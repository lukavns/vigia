'use client';

import { useMemo, useState } from 'react';
import { PriorityList } from '../../components/PriorityList';
import { RiskRanking } from '../../components/RiskRanking';
import { SummaryGrid } from '../../components/SummaryGrid';
import { ZoneSummary } from '../../components/ZoneSummary';
import { neighborhoodName, neighborhoods, zones } from '../../lib/data';
import { incidenceLabels, reportTypeLabels, riskLabels } from '../../lib/labels';
import { useReports } from '../../lib/reports';
import type { Incidence, RiskLevel, Zone } from '../../lib/types';
import { RiskMap } from './RiskMap';

const riskOptions: RiskLevel[] = ['baixo', 'moderado', 'alto', 'critico'];
const incidenceOptions: Incidence[] = ['low', 'medium', 'high', 'unverified'];

export function MapExperience() {
  const { reports } = useReports();
  const [riskFilter, setRiskFilter] = useState<RiskLevel | ''>('');
  const [incidenceFilter, setIncidenceFilter] = useState<Incidence | ''>('');
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [alertArea, setAlertArea] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const visibleNeighborhoods = useMemo(
    () => (riskFilter ? neighborhoods.filter((neighborhood) => neighborhood.riskLevel === riskFilter) : neighborhoods),
    [riskFilter]
  );

  const visibleZones = useMemo(() => {
    const term = normalize(search);

    return zones.filter((zone) => {
      if (incidenceFilter && zone.incidence !== incidenceFilter) {
        return false;
      }

      return !term
        || [zone.name, zone.category, neighborhoodName(zone.neighborhoodId)].some((text) => normalize(text).includes(term));
    });
  }, [incidenceFilter, search]);

  const hasFilters = Boolean(riskFilter || incidenceFilter || search);

  const zoneReports = selectedZone
    ? reports.filter((report) => report.status === 'approved' && report.neighborhoodId === selectedZone.neighborhoodId)
    : [];

  const clearFilters = () => {
    setRiskFilter('');
    setIncidenceFilter('');
    setSearch('');
  };

  const subscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const area = alertArea ? neighborhoodName(alertArea) : 'toda Maceió';
    setAlertMessage(`Alerta de demonstração ativado para ${area}. Nenhuma notificação real será enviada.`);
  };

  return (
    <main className="page map-page">
      <section className="page-heading">
        <div>
          <p className="kicker">Mapa operacional</p>
          <h1>Índice de criminalidade em Maceió</h1>
          <p>Compare regiões, zonas monitoradas e níveis de atenção por bairro a partir de um índice simulado.</p>
        </div>

        <a href="#zonas" className="button">Ver ocorrências</a>
      </section>

      <SummaryGrid />

      <p className="source-note">
        Dados fictícios criados para demonstração. Os percentuais não representam estatística oficial.
      </p>

      <section className="panel filter-panel" aria-label="Filtros do mapa">
        <label>
          Risco do bairro
          <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value as RiskLevel | '')}>
            <option value="">Todos os níveis</option>
            {riskOptions.map((risk) => (
              <option key={risk} value={risk}>{riskLabels[risk]}</option>
            ))}
          </select>
        </label>

        <label>
          Incidência da zona
          <select value={incidenceFilter} onChange={(event) => setIncidenceFilter(event.target.value as Incidence | '')}>
            <option value="">Todas</option>
            {incidenceOptions.map((incidence) => (
              <option key={incidence} value={incidence}>{incidenceLabels[incidence]}</option>
            ))}
          </select>
        </label>

        <label>
          Buscar zona ou bairro
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ex.: furto, Centro..."
          />
        </label>

        <button type="button" className="button secondary" onClick={clearFilters} disabled={!hasFilters}>
          Limpar filtros
        </button>
      </section>

      <section className="workbench">
        <div className="panel map-panel">
          <div className="map-toolbar">
            <div>
              <strong>Maceió</strong>
              <span>
                {visibleNeighborhoods.length} de {neighborhoods.length} bairros · {visibleZones.length} de {zones.length} zonas
              </span>
            </div>
            <ul className="legend" aria-label="Legenda de risco">
              {riskOptions.map((risk) => (
                <li key={risk}><i className={risk} /> {riskLabels[risk]}</li>
              ))}
            </ul>
          </div>

          <div className="map-canvas">
            <RiskMap
              neighborhoods={visibleNeighborhoods}
              zones={visibleZones}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
            />
          </div>
        </div>

        <RiskRanking neighborhoods={visibleNeighborhoods} />
      </section>

      <section id="zonas" className="zones-section">
        <header>
          <div>
            <p className="kicker">Ocorrências</p>
            <h2>Zonas e eventos monitorados</h2>
          </div>
        </header>

        {selectedZone ? (
          <article className="panel selected-zone" aria-live="polite">
            <div className="selected-zone-heading">
              <ZoneSummary zone={selectedZone} />
              <button type="button" className="button secondary" onClick={() => setSelectedZone(null)}>Fechar</button>
            </div>

            <div className="selected-zone-body">
              <div>
                <h3>Ocorrências validadas em {neighborhoodName(selectedZone.neighborhoodId)}</h3>
                {zoneReports.length === 0 ? (
                  <p className="empty-state">Nenhuma ocorrência validada para este bairro ainda.</p>
                ) : (
                  <ul className="zone-reports">
                    {zoneReports.map((report) => (
                      <li key={report.id}>
                        <strong>{reportTypeLabels[report.type]}</strong>
                        <span>{report.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <a
                className="text-link"
                href={`https://www.google.com/maps/search/?api=1&query=${selectedZone.latitude},${selectedZone.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir no Google Maps
              </a>
            </div>
          </article>
        ) : null}

        {visibleZones.length === 0 ? (
          <p className="empty-state">Nenhuma zona corresponde aos filtros.</p>
        ) : (
          <ul className="zones-grid">
            {visibleZones.map((zone) => (
              <li key={zone.id}>
                <button
                  type="button"
                  className="zone-card"
                  aria-pressed={selectedZone?.id === zone.id}
                  onClick={() => setSelectedZone(zone)}
                >
                  <ZoneSummary zone={zone} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PriorityList />

      <section className="panel alert-signup">
        <div>
          <p className="kicker">Alertas</p>
          <h2>Receba avisos sobre mudanças de risco</h2>
          <p>Escolha um bairro ou acompanhe as variações do índice na cidade inteira.</p>
        </div>

        <form onSubmit={subscribe}>
          <label>
            Bairro
            <select value={alertArea} onChange={(event) => setAlertArea(event.target.value)}>
              <option value="">Toda Maceió</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood.id} value={neighborhood.id}>{neighborhood.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="button">Ativar alertas</button>
        </form>

        {alertMessage ? <p className="message success" role="status">{alertMessage}</p> : null}
      </section>
    </main>
  );
}

function normalize(text: string) {
  return text.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
