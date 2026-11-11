import { getNeighborhood, priorities, priorityLevel } from '../lib/data';
import { formatPercent, priorityLabels } from '../lib/labels';

export function PriorityList() {
  return (
    <section className="panel priority-section">
      <header>
        <div>
          <p className="kicker">Priorização</p>
          <h2>Regiões que exigem mais atenção</h2>
        </div>
        <p>Bairros ordenados pelo índice simulado, com o volume de ocorrências e chamados do período.</p>
      </header>

      <ul className="priority-list">
        {priorities.map((priority) => {
          const neighborhood = getNeighborhood(priority.neighborhoodId);
          if (!neighborhood) {
            return null;
          }

          const level = priorityLevel(neighborhood.score);

          return (
            <li key={priority.neighborhoodId}>
              <div>
                <strong>{neighborhood.name}</strong>
                <span>{priority.reason}</span>
                <small>
                  {neighborhood.population.toLocaleString('pt-BR')} moradores · {priority.incidents} ocorrências · {priority.calls} chamados
                </small>
              </div>
              <span className={`priority-badge ${level}`}>
                {priorityLabels[level]} · {formatPercent(neighborhood.score)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
