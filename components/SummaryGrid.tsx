import { overview } from '../lib/data';

export function SummaryGrid() {
  return (
    <section className="summary-grid" aria-label="Resumo do monitoramento">
      <article>
        <strong>{overview.neighborhoods}</strong>
        <span>bairros monitorados</span>
      </article>
      <article>
        <strong>{overview.zones}</strong>
        <span>zonas analisadas</span>
      </article>
      <article>
        <strong>{overview.onAlert}</strong>
        <span>bairros em alerta</span>
      </article>
      <article>
        <strong>{overview.topRisk}</strong>
        <span>maior prioridade</span>
      </article>
    </section>
  );
}
