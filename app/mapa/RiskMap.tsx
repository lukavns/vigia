'use client';

import { useEffect, useRef, useState } from 'react';
import type { LatLngTuple, LayerGroup, Map as LeafletMap } from 'leaflet';
import { neighborhoodName } from '../../lib/data';
import { formatPercent, incidenceColors, incidenceLabels, riskColors, riskLabels } from '../../lib/labels';
import type { Bounds, Neighborhood, Zone } from '../../lib/types';

type Leaflet = typeof import('leaflet');

interface RiskMapProps {
  neighborhoods: Neighborhood[];
  zones: Zone[];
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone) => void;
}

const MACEIO: LatLngTuple = [-9.6498, -35.7089];

const markerRadius = { critico: 14, alto: 12, moderado: 11, baixo: 10 };

export function RiskMap({ neighborhoods, zones, selectedZone, onSelectZone }: RiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<Leaflet | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const regionLayerRef = useRef<LayerGroup | null>(null);
  const zoneLayerRef = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // O Leaflet acessa window ao ser importado, por isso só carrega no cliente.
    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current) {
        return;
      }

      const map = L.map(containerRef.current, {
        center: MACEIO,
        zoom: 12,
        minZoom: 11,
        maxZoom: 18
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      leafletRef.current = L;
      mapRef.current = map;
      regionLayerRef.current = L.layerGroup().addTo(map);
      zoneLayerRef.current = L.layerGroup().addTo(map);
      setReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = regionLayerRef.current;
    if (!ready || !L || !map || !layer) {
      return;
    }

    layer.clearLayers();
    const visible = L.latLngBounds([]);

    for (const neighborhood of neighborhoods) {
      const color = riskColors[neighborhood.riskLevel];
      const area = shrink(neighborhood.bounds, 0.25);
      const [south, west, north, east] = area;
      const popup = `
        <strong>${neighborhood.name}</strong><br>
        Risco: ${riskLabels[neighborhood.riskLevel]}<br>
        Índice: ${formatPercent(neighborhood.score)}
      `;

      L.polygon(roundedRect(area), {
        color,
        fillColor: color,
        fillOpacity: 0.12,
        opacity: 0.35,
        weight: 1
      })
        .bindPopup(popup)
        .addTo(layer);

      L.circleMarker([(south + north) / 2, (west + east) / 2], {
        radius: markerRadius[neighborhood.riskLevel],
        color: '#ffffff',
        fillColor: color,
        fillOpacity: 0.96,
        weight: 4
      })
        .bindTooltip(`<strong>${neighborhood.name}</strong><span>${formatPercent(neighborhood.score)}</span>`, {
          permanent: true,
          direction: 'top',
          offset: [0, -12],
          className: `neighborhood-label ${neighborhood.riskLevel}`
        })
        .bindPopup(popup)
        .addTo(layer);

      visible.extend([[south, west], [north, east]]);
    }

    if (visible.isValid()) {
      map.fitBounds(visible, { padding: [24, 24] });
    }
  }, [ready, neighborhoods]);

  useEffect(() => {
    const L = leafletRef.current;
    const layer = zoneLayerRef.current;
    if (!ready || !L || !layer) {
      return;
    }

    layer.clearLayers();

    for (const zone of zones) {
      L.circleMarker([zone.latitude, zone.longitude], {
        radius: 8,
        color: '#ffffff',
        fillColor: incidenceColors[zone.incidence],
        fillOpacity: 0.95,
        weight: 3
      })
        .bindPopup(`
          <strong>${zone.name}</strong><br>
          ${zone.category} · ${neighborhoodName(zone.neighborhoodId)}<br>
          ${incidenceLabels[zone.incidence]}
        `)
        .on('click', () => onSelectZone(zone))
        .addTo(layer);
    }
  }, [ready, zones, onSelectZone]);

  useEffect(() => {
    if (ready && selectedZone) {
      mapRef.current?.setView([selectedZone.latitude, selectedZone.longitude], 15);
    }
  }, [ready, selectedZone]);

  return <div ref={containerRef} className="leaflet-map" aria-label="Mapa com bairros e índices de criminalidade" />;
}

// Os limites dos bairros são retângulos aproximados. Desenhar a área reduzida
// e com cantos arredondados evita que pareçam divisas oficiais.
function shrink([south, west, north, east]: Bounds, ratio: number): Bounds {
  const lat = (north - south) * ratio;
  const lng = (east - west) * ratio;

  return [south + lat, west + lng, north - lat, east - lng];
}

function roundedRect([south, west, north, east]: Bounds): LatLngTuple[] {
  const latRadius = (north - south) * 0.18;
  const lngRadius = (east - west) * 0.18;
  const steps = 5;
  const points: LatLngTuple[] = [];

  const corner = (lat: number, lng: number, from: number, to: number) => {
    for (let step = 0; step <= steps; step += 1) {
      const angle = ((from + ((to - from) * step) / steps) * Math.PI) / 180;
      points.push([lat + Math.sin(angle) * latRadius, lng + Math.cos(angle) * lngRadius]);
    }
  };

  corner(north - latRadius, east - lngRadius, 90, 0);
  corner(south + latRadius, east - lngRadius, 0, -90);
  corner(south + latRadius, west + lngRadius, -90, -180);
  corner(north - latRadius, west + lngRadius, 180, 90);

  return points;
}
