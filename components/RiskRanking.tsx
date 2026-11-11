import { formatPercent, riskLabels } from '../lib/labels';
import type { Neighborhood } from '../lib/types';

export function RiskRanking({ neighborhoods }: { neighborhoods: Neighborhood[] }) {
  return (
    <aside className="panel risk-panel">
      <header>
        <p className="kicker">Ranking</p>
        <h2>Bairros por prioridade</h2>
      </header>

      {neighborhoods.length === 0 ? (
        <p className="empty-state">Nenhum bairro nesse nível de risco.</p>
      ) : (
        <ol className="risk-list">
          {neighborhoods.map((neighborhood) => (
            <li key={neighborhood.id}>
              <span className={`risk-dot ${neighborhood.riskLevel}`} aria-hidden="true" />
              <div>
                <strong>{neighborhood.name}</strong>
                <span>
                  {riskLabels[neighborhood.riskLevel]} · {neighborhood.population.toLocaleString('pt-BR')} moradores
                </span>
              </div>
              <span className={`risk-badge ${neighborhood.riskLevel}`}>{formatPercent(neighborhood.score)}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
