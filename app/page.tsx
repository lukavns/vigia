import Link from 'next/link';
import { PriorityList } from '../components/PriorityList';
import { RiskRanking } from '../components/RiskRanking';
import { SummaryGrid } from '../components/SummaryGrid';
import { ZoneSummary } from '../components/ZoneSummary';
import { neighborhoods, overview, zones } from '../lib/data';
import './home.css';

export default function HomePage() {
  return (
    <main className="page home-page">
      <section className="page-heading">
        <div>
          <p className="kicker">Painel operacional</p>
          <h1>Vigia Maceió</h1>
          <p>
            Protótipo acadêmico para visualizar um índice simulado de criminalidade por região,
            comparar bairros e apoiar ações preventivas em Maceió.
          </p>
        </div>

        <Link className="button" href="/mapa">Abrir mapa</Link>
      </section>

      <SummaryGrid />

      <p className="source-note">
        Dados fictícios criados para demonstração. Os percentuais não representam estatística oficial.
      </p>

      <section className="workbench">
        <div className="panel map-panel">
          <div className="map-toolbar">
            <div>
              <strong>Maceió</strong>
              <span>Prévia do índice por região</span>
            </div>
            <ul className="legend" aria-label="Legenda de risco">
              <li><i className="baixo" /> Baixo</li>
              <li><i className="moderado" /> Moderado</li>
              <li><i className="alto" /> Alto</li>
              <li><i className="critico" /> Crítico</li>
            </ul>
          </div>

          <Link className="preview-canvas" href="/mapa" aria-label="Abrir o mapa interativo">
            <svg viewBox="0 0 420 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <path d="M316 0h104v162l-44 32-60-38z" className="water" />
              <path d="M42 48l108-12 12 86-112 12z" className="region baixo" />
              <path d="M162 38l98 16-18 90-82-22z" className="region moderado" />
              <path d="M50 148l112-14 16 82-118 20z" className="region alto" />
              <path d="M178 136l104 12-24 86-82-18z" className="region baixo" />
              <path d="M64 246l114-22 14 72-120 14z" className="region moderado" />
              <path d="M192 228l98 16-22 62-76-10z" className="region critico" />
              <path d="M0 160h318" className="road" />
              <path d="M154 0v320" className="road" />
            </svg>

            <span className="map-pin patrulha"><span>Patrulha</span></span>
            <span className="map-pin alerta"><span>Alerta</span></span>
            <span className="map-pin risco"><span>Risco alto</span></span>
            <span className="map-pin centro"><span>Centro</span></span>
          </Link>
        </div>

        <RiskRanking neighborhoods={neighborhoods} />
      </section>

      <section className="panel callout">
        <div>
          <p className="kicker">Extensão</p>
          <h2>Leitura rápida para orientar prevenção</h2>
          <p>
            A interface organiza regiões, percentuais e zonas de atenção em um fluxo simples
            para apresentação, discussão e tomada de decisão em contexto acadêmico.
          </p>
        </div>

        <div className="callout-metric">
          <strong>{overview.onAlert}</strong>
          <span>regiões com risco alto ou crítico no cenário simulado</span>
        </div>
      </section>

      <PriorityList />

      <section className="zones-section">
        <header>
          <div>
            <p className="kicker">Ocorrências</p>
            <h2>Zonas e eventos monitorados</h2>
          </div>
          <Link className="text-link" href="/mapa#zonas">Ver no mapa</Link>
        </header>

        <ul className="zones-grid">
          {zones.map((zone) => (
            <li key={zone.id} className="zone-card">
              <ZoneSummary zone={zone} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
