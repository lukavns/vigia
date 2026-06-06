'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { LatLngBounds, LatLngExpression, LayerGroup, Map as LeafletMap } from 'leaflet';
import {
  incidentPoints as fixtureIncidentPoints,
  mappingPriorities as fixtureMappingPriorities,
  neighborhoods as fixtureNeighborhoods,
  overview as fixtureOverview
} from '../../lib/fixtures';
import { publicApi } from '../../lib/api';
import type { IncidentPoint, IncidentProfile, MappingPriority, Neighborhood, Overview, RiskLevel } from '../../lib/types';

type LeafletModule = typeof import('leaflet');

const riskLabels: Record<RiskLevel, string> = {
  critico: 'Crítico',
  alto: 'Alto',
  moderado: 'Moderado',
  medio: 'Médio',
  baixo: 'Baixo',
  sem_dados: 'Sem dados'
};

const profileLabels: Record<IncidentProfile, string> = {
  healthy: 'Baixa incidência',
  mixed: 'Incidência moderada',
  ultra_processed_predominant: 'Alta incidência',
  unknown: 'Monitoramento em validação'
};

export function MapExperience() {
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const neighborhoodsLayerRef = useRef<LayerGroup | null>(null);
  const pointsLayerRef = useRef<LayerGroup | null>(null);
  const [overview, setOverview] = useState<Overview>(fixtureOverview);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(fixtureNeighborhoods);
  const [incidentPoints, setIncidentPoints] = useState<IncidentPoint[]>(fixtureIncidentPoints);
  const [mappingPriorities, setMappingPriorities] = useState<MappingPriority[]>(fixtureMappingPriorities);
  const [mapStatus, setMapStatus] = useState('Mapa de criminalidade de Maceió pronto');
  const [riskFilter, setRiskFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('');
  const [pointSearch, setPointSearch] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<IncidentPoint | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

  const filteredNeighborhoods = useMemo(
    () => riskFilter ? neighborhoods.filter((neighborhood) => neighborhood.riskLevel === riskFilter) : neighborhoods,
    [riskFilter]
  );

  const filteredPoints = useMemo(() => {
    const normalizedSearch = pointSearch.trim().toLowerCase();

    return incidentPoints.filter((point) => {
      const matchesProfile = !profileFilter || point.profile === profileFilter;
      const matchesSearch = !normalizedSearch
        || point.name.toLowerCase().includes(normalizedSearch)
        || point.neighborhood.toLowerCase().includes(normalizedSearch)
        || point.category.toLowerCase().includes(normalizedSearch);

      return matchesProfile && matchesSearch;
    });
  }, [pointSearch, profileFilter]);

  useEffect(() => {
    let disposed = false;

    async function initializeMap() {
      const L = await import('leaflet');
      if (disposed || mapRef.current) {
        return;
      }

      leafletRef.current = L;
      const map = L.map('mvp-map', {
        center: [-9.6498, -35.7089],
        zoom: 12,
        minZoom: 11,
        maxZoom: 18,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapRef.current = map;
      neighborhoodsLayerRef.current = L.layerGroup().addTo(map);
      pointsLayerRef.current = L.layerGroup().addTo(map);
      setTimeout(() => map.invalidateSize(), 0);
    }

    void initializeMap();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      neighborhoodsLayerRef.current = null;
      pointsLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let disposed = false;

    async function loadMapData() {
      try {
        const [overviewData, neighborhoodData, incidentData, priorityData] = await Promise.all([
          publicApi.overview(),
          publicApi.neighborhoods(),
          publicApi.incidentPoints(),
          publicApi.mappingPriorities()
        ]);

        if (disposed) {
          return;
        }

        setOverview(overviewData);
        setNeighborhoods(neighborhoodData);
        setIncidentPoints(incidentData);
        setMappingPriorities(priorityData);
        setMapStatus('Dados carregados da API Next');
      } catch {
        setMapStatus('Usando dados locais de demonstração');
      }
    }

    void loadMapData();

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    renderMapLayers();
  }, [filteredNeighborhoods, filteredPoints]);

  const resetFilters = () => {
    setRiskFilter('');
    setProfileFilter('');
    setPointSearch('');
  };

  const focusPoint = (point: IncidentPoint) => {
    setSelectedPoint(point);

    if (!mapRef.current || point.latitude == null || point.longitude == null) {
      return;
    }

    mapRef.current.setView([Number(point.latitude), Number(point.longitude)], 15, {
      animate: true
    });
  };

  const googleMapsUrl = (point: IncidentPoint) => {
    if (point.latitude != null && point.longitude != null) {
      return `https://www.google.com/maps/search/?api=1&query=${Number(point.latitude)},${Number(point.longitude)}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${point.name} ${point.neighborhood} Maceió AL`
    )}`;
  };

  const subscribeToAlerts = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAlertMessage('Alertas simulados ativados para o recorte selecionado.');
  };

  function renderMapLayers() {
    const L = leafletRef.current;
    const map = mapRef.current;
    const neighborhoodsLayer = neighborhoodsLayerRef.current;
    const pointsLayer = pointsLayerRef.current;

    if (!L || !map || !neighborhoodsLayer || !pointsLayer) {
      return;
    }

    neighborhoodsLayer.clearLayers();
    pointsLayer.clearLayers();

    const bounds = L.latLngBounds([]);

    for (const neighborhood of filteredNeighborhoods) {
      if (!neighborhood.geometry) {
        continue;
      }

      try {
        const sourceBounds = L.geoJSON(JSON.parse(neighborhood.geometry)).getBounds();
        if (!sourceBounds.isValid()) {
          continue;
        }

        const displayBounds = insetBounds(sourceBounds, 0.25);
        const layer = L.polygon(roundedBounds(displayBounds), {
          color: riskColor(neighborhood.riskLevel),
          fillColor: riskColor(neighborhood.riskLevel),
          fillOpacity: 0.09,
          opacity: 0.24,
          weight: 1
        }).bindPopup(`
          <strong>${neighborhood.name}</strong><br>
          Risco: ${riskLabels[neighborhood.riskLevel]}<br>
          Índice: ${Number(neighborhood.score).toFixed(1)}%
        `);
        const neighborhoodMarker = L.circleMarker(displayBounds.getCenter(), {
          radius: neighborhoodMarkerRadius(neighborhood.riskLevel),
          color: '#ffffff',
          fillColor: riskColor(neighborhood.riskLevel),
          fillOpacity: 0.96,
          opacity: 1,
          weight: 4,
          className: 'neighborhood-risk-marker'
        })
          .bindTooltip(
            `<strong>${neighborhood.name}</strong><span>${Number(neighborhood.score).toFixed(1)}%</span>`,
            {
              permanent: true,
              direction: 'top',
              offset: [0, -12],
              className: `neighborhood-marker-label ${neighborhood.riskLevel}`
            }
          )
          .bindPopup(`
            <strong>${neighborhood.name}</strong><br>
            Risco: ${riskLabels[neighborhood.riskLevel]}<br>
            Índice: ${Number(neighborhood.score).toFixed(1)}%
          `);

        layer.addTo(neighborhoodsLayer);
        neighborhoodMarker.addTo(neighborhoodsLayer);
        bounds.extend(displayBounds);
      } catch {
        setMapStatus('Algumas geometrias não puderam ser desenhadas');
      }
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24] });
    }

    for (const point of filteredPoints) {
      if (point.latitude == null || point.longitude == null) {
        continue;
      }

      const marker = L.circleMarker([Number(point.latitude), Number(point.longitude)], {
        radius: 9,
        color: '#ffffff',
        fillColor: profileColor(point.profile),
        fillOpacity: 0.95,
        weight: 4
      }).bindPopup(`
        <strong>${point.name}</strong><br>
        ${point.category} · ${point.neighborhood}<br>
        ${profileLabels[point.profile]}<br>
        <a href="${googleMapsUrl(point)}" target="_blank" rel="noopener">Abrir no Google Maps</a>
      `);

      marker.on('click', () => focusPoint(point));
      marker.addTo(pointsLayer);
    }
  }

  function insetBounds(bounds: LatLngBounds, ratio: number) {
    const L = leafletRef.current;
    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const east = bounds.getEast();
    const latInset = (north - south) * ratio;
    const lngInset = (east - west) * ratio;

    return L!.latLngBounds([south + latInset, west + lngInset], [north - latInset, east - lngInset]);
  }

  function roundedBounds(bounds: LatLngBounds): LatLngExpression[] {
    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const east = bounds.getEast();
    const latRadius = (north - south) * 0.18;
    const lngRadius = (east - west) * 0.18;
    const points: LatLngExpression[] = [];
    const addArc = (centerLat: number, centerLng: number, from: number, to: number) => {
      const steps = 5;
      for (let index = 0; index <= steps; index += 1) {
        const angle = ((from + ((to - from) * index) / steps) * Math.PI) / 180;
        points.push([centerLat + Math.sin(angle) * latRadius, centerLng + Math.cos(angle) * lngRadius]);
      }
    };

    addArc(north - latRadius, east - lngRadius, 90, 0);
    addArc(south + latRadius, east - lngRadius, 0, -90);
    addArc(south + latRadius, west + lngRadius, -90, -180);
    addArc(north - latRadius, west + lngRadius, 180, 90);

    return points;
  }

  return (
    <main className="map-page">
      <section className="page-heading">
        <div>
          <p className="kicker">Mapa operacional</p>
          <h1>Índice de criminalidade em Maceió</h1>
          <p>MVP com dados fictícios em porcentagem para comparar regiões, ocorrências e níveis de atenção por bairro.</p>
        </div>

        <a href="#zonas-monitoradas" className="report-link">Ver ocorrências</a>
      </section>

      <section className="summary-grid" aria-label="Resumo do monitoramento">
        <article>
          <strong>{overview.totalNeighborhoods}</strong>
          <span>bairros monitorados</span>
        </article>
        <article>
          <strong>{overview.totalFoodPoints}</strong>
          <span>zonas analisadas</span>
        </article>
        <article>
          <strong>{overview.highRiskNeighborhoods}</strong>
          <span>bairros em alerta</span>
        </article>
        <article>
          <strong>{overview.topRiskNeighborhood}</strong>
          <span>maior prioridade</span>
        </article>
      </section>

      <p className="source-note">
        Dados fictícios criados para demonstração acadêmica. Os percentuais representam um índice simulado de criminalidade por região.
      </p>

      <section className="alert-signup" aria-label="Assinatura de alertas">
        <div>
          <p className="kicker">Alertas PWA</p>
          <h2>Receba avisos sobre mudanças de risco</h2>
          <p>Escolha um bairro ou acompanhe alertas gerais sobre variações no índice.</p>
        </div>

        <form onSubmit={subscribeToAlerts}>
          <label>
            Bairro
            <select name="alertNeighborhood">
              <option value="">Toda Maceió</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood.name} value={neighborhood.id ?? ''}>{neighborhood.name}</option>
              ))}
            </select>
          </label>
          <button type="submit">Ativar alertas</button>
        </form>
        {alertMessage ? <p className="alert-feedback success">{alertMessage}</p> : null}
      </section>

      <section className="map-filter-panel" aria-label="Filtros do mapa">
        <label>
          Risco
          <select name="riskFilter" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
            <option value="">Todos os riscos</option>
            <option value="sem_dados">Sem dados</option>
            <option value="baixo">Baixo</option>
            <option value="moderado">Médio</option>
            <option value="alto">Alto</option>
            <option value="critico">Crítico</option>
          </select>
        </label>

        <label>
          Tipo de incidência
          <select name="profileFilter" value={profileFilter} onChange={(event) => setProfileFilter(event.target.value)}>
            <option value="">Todos os tipos</option>
            <option value="healthy">Baixa incidência</option>
            <option value="mixed">Incidência moderada</option>
            <option value="ultra_processed_predominant">Alta incidência</option>
            <option value="unknown">Em validação</option>
          </select>
        </label>

        <label>
          Buscar ocorrência ou bairro
          <input
            name="pointSearch"
            value={pointSearch}
            onChange={(event) => setPointSearch(event.target.value)}
            placeholder="Ex.: furto, Centro..."
          />
        </label>

        <button type="button" className="secondary-button" onClick={resetFilters}>Limpar filtros</button>
      </section>

      <section className="workbench">
        <div className="map-panel" aria-label="Mapa de criminalidade de Maceió">
          <div className="map-toolbar">
            <div>
              <strong>Maceió</strong>
              <span>{mapStatus}</span>
            </div>
            <div className="map-legend">
              <span><i className="no-data" /> Sem dados</span>
              <span><i className="low" /> Baixo</span>
              <span><i className="medium" /> Médio</span>
              <span><i className="high" /> Alto</span>
              <span><i className="critical" /> Crítico</span>
            </div>
          </div>

          <div className="map-canvas">
            <div id="mvp-map" className="leaflet-map" aria-label="Mapa com bairros e índices de criminalidade" />
          </div>
        </div>

        <aside className="risk-panel">
          <header>
            <p className="kicker">Ranking</p>
            <h2>Bairros por prioridade</h2>
          </header>

          <div className="risk-list">
            {filteredNeighborhoods.map((neighborhood) => (
              <article key={neighborhood.name}>
                <span className={`risk-dot ${neighborhood.riskLevel}`} aria-hidden="true" />
                <div className="risk-copy">
                  <strong className="risk-name">{neighborhood.name}</strong>
                  <span>{neighborhood.population.toLocaleString('pt-BR')} moradores</span>
                </div>
                <mark className={`risk-badge ${neighborhood.riskLevel}`}>
                  {neighborhood.riskLevel === 'sem_dados' ? 'Sem dados' : `${neighborhood.score.toFixed(1)}%`}
                </mark>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="mapping-priority-section">
        <header>
          <div>
            <p className="kicker">Priorização</p>
            <h2>Regiões que exigem mais atenção</h2>
          </div>
          <p>Esta lista organiza bairros a partir de percentuais fictícios de ocorrências, chamados e monitoramento preventivo.</p>
        </header>

        <div className="mapping-priority-list">
          {mappingPriorities.map((priority) => (
            <article key={priority.neighborhood}>
              <div>
                <strong>{priority.neighborhood}</strong>
                <span>{priority.reason}</span>
                <small>
                  {priority.population.toLocaleString('pt-BR')} moradores · {priority.foodPoints} ocorrência(s) simulada(s) · {priority.reports} chamado(s)
                </small>
              </div>
              <mark className={`priority-badge ${priority.priorityLevel}`}>
                {priority.priorityLevel === 'alta' ? 'Alta' : priority.priorityLevel === 'media' ? 'Média' : 'Baixa'} · {priority.priorityScore.toFixed(1)}%
              </mark>
            </article>
          ))}
        </div>
      </section>

      <section id="zonas-monitoradas" className="points-section">
        <header>
          <p className="kicker">Ocorrências</p>
          <h2>Zonas e eventos monitorados</h2>
        </header>

        {selectedPoint ? (
          <article className="selected-point-panel">
            <div className="selected-point-main">
              <span className={`profile ${selectedPoint.profile}`} aria-hidden="true" />
              <div>
                <strong>{selectedPoint.name}</strong>
                <p>{selectedPoint.category} em {selectedPoint.neighborhood}</p>
                <small>{profileLabels[selectedPoint.profile]}</small>
              </div>
            </div>

            <div className="selected-point-content">
              <div className="point-report-list">
                <h3>Últimas ocorrências desta região</h3>
                <p className="point-report-empty">Nenhuma ocorrência validada para esta região ainda.</p>
              </div>

              <a href={googleMapsUrl(selectedPoint)} target="_blank" rel="noopener">Abrir no Google Maps</a>
            </div>
          </article>
        ) : null}

        <div className="points-grid">
          {filteredPoints.map((point) => (
            <article
              key={point.name}
              role="button"
              tabIndex={0}
              className={selectedPoint?.name === point.name ? 'selected' : undefined}
              onClick={() => focusPoint(point)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  focusPoint(point);
                }
              }}
            >
              <span className={`profile ${point.profile}`} />
              <div>
                <strong>{point.name}</strong>
                <p>{point.category} em {point.neighborhood}</p>
                <small>{profileLabels[point.profile]}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function riskColor(riskLevel: RiskLevel) {
  return {
    critico: '#991b1b',
    alto: '#dc2626',
    moderado: '#b7790d',
    medio: '#b7790d',
    baixo: '#ef9a9a',
    sem_dados: '#647276'
  }[riskLevel] ?? '#647276';
}

function neighborhoodMarkerRadius(riskLevel: RiskLevel) {
  return {
    critico: 14,
    alto: 12,
    moderado: 11,
    medio: 11,
    baixo: 10,
    sem_dados: 9
  }[riskLevel] ?? 9;
}

function profileColor(profile: IncidentProfile) {
  return {
    healthy: '#7a1f1f',
    mixed: '#d97706',
    ultra_processed_predominant: '#b91c1c',
    unknown: '#647276'
  }[profile] ?? '#647276';
}
