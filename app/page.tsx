import Link from 'next/link';
import { incidentPoints, mappingPriorities, neighborhoods, overview } from '../lib/fixtures';
import './page.css';

export default function HomePage() {
  const criticalNeighborhoods = neighborhoods.filter((neighborhood) =>
    ['critico', 'alto'].includes(neighborhood.riskLevel)
  );

  return (
    <main className="home-page">
      <section className="page-heading">
        <div>
          <p className="kicker">Painel operacional</p>
          <h1>Vigia Maceió</h1>
          <p>
            MVP acadêmico para visualizar percentuais fictícios de criminalidade por região,
            comparar bairros e apoiar ações preventivas em Maceió.
          </p>
        </div>

        <Link className="report-link" href="/mapa">Abrir mapa</Link>
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
        Dados fictícios criados para demonstração acadêmica. Os percentuais não representam estatística oficial.
      </p>

      <section className="workbench">
        <div className="map-panel" aria-label="Prévia operacional do mapa">
          <div className="map-toolbar">
            <div>
              <strong>Maceió</strong>
              <span>Prévia visual do índice por região</span>
            </div>
            <div className="legend">
              <span><i className="low" /> Baixo</span>
              <span><i className="medium" /> Médio</span>
              <span><i className="high" /> Alto</span>
              <span><i className="critical" /> Crítico</span>
            </div>
          </div>

          <div className="preview-canvas">
            <svg viewBox="0 0 420 320" role="img" aria-label="Mapa estilizado com bairros e pontos de risco">
              <path d="M316 0h104v162l-44 32-60-38z" className="water" />
              <path d="M42 48l108-12 12 86-112 12z" className="risk-low" />
              <path d="M162 38l98 16-18 90-82-22z" className="risk-medium" />
              <path d="M50 148l112-14 16 82-118 20z" className="risk-high" />
              <path d="M178 136l104 12-24 86-82-18z" className="risk-low" />
              <path d="M64 246l114-22 14 72-120 14z" className="risk-medium" />
              <path d="M192 228l98 16-22 62-76-10z" className="risk-critical" />
              <path d="M0 160h318" className="road" />
              <path d="M154 0v320" className="road" />
            </svg>

            <div className="map-pin patrulha"><span>Patrulha</span></div>
            <div className="map-pin alerta"><span>Alerta</span></div>
            <div className="map-pin risco"><span>Risco alto</span></div>
            <div className="map-pin centro"><span>Centro</span></div>
          </div>
        </div>

        <aside className="risk-panel">
          <header>
            <p className="kicker">Ranking</p>
            <h2>Bairros por prioridade</h2>
          </header>

          <div className="risk-list">
            {neighborhoods.map((neighborhood) => (
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

      <section className="alert-signup" aria-label="Objetivo do MVP">
        <div>
          <p className="kicker">Extensão</p>
          <h2>Leitura rápida para orientar prevenção</h2>
          <p>
            A interface organiza regiões, percentuais e zonas de atenção em um fluxo simples
            para apresentação, discussão e tomada de decisão em contexto acadêmico.
          </p>
        </div>

        <div className="alert-metric">
          <strong>{criticalNeighborhoods.length}</strong>
          <span>regiões com risco alto ou crítico no cenário fictício</span>
        </div>
      </section>

      <section className="mapping-priority-section">
        <header>
          <div>
            <p className="kicker">Priorização</p>
            <h2>Regiões que exigem mais atenção</h2>
          </div>
          <p>
            Bairros organizados por percentuais fictícios de ocorrências, chamados e monitoramento preventivo.
          </p>
        </header>

        <div className="mapping-priority-list">
          {mappingPriorities.map((priority) => (
            <article key={priority.neighborhood}>
              <div>
                <strong>{priority.neighborhood}</strong>
                <span>{priority.reason}</span>
                <small>
                  {priority.population.toLocaleString('pt-BR')} moradores · {priority.foodPoints} ocorrência(s) simulada(s)
                </small>
              </div>
              <mark className={`priority-badge ${priority.priorityLevel}`}>
                {priority.priorityLevel === 'alta' ? 'Alta' : priority.priorityLevel === 'media' ? 'Média' : 'Baixa'} · {priority.priorityScore.toFixed(1)}%
              </mark>
            </article>
          ))}
        </div>
      </section>

      <section className="points-section">
        <header>
          <p className="kicker">Ocorrências</p>
          <h2>Zonas e eventos monitorados</h2>
        </header>

        <div className="points-grid">
          {incidentPoints.map((point) => (
            <article key={point.name}>
              <span className={`profile ${point.profile}`} />
              <div>
                <strong>{point.name}</strong>
                <p>{point.category} em {point.neighborhood}</p>
                <small>{profileLabel(point.profile)}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function profileLabel(profile: string) {
  return {
    healthy: 'Baixa incidência',
    mixed: 'Incidência moderada',
    ultra_processed_predominant: 'Alta incidência',
    unknown: 'Monitoramento em validação'
  }[profile] ?? profile;
}
