import { neighborhoodName } from '../lib/data';
import { incidenceLabels } from '../lib/labels';
import type { Zone } from '../lib/types';

export function ZoneSummary({ zone }: { zone: Zone }) {
  return (
    <>
      <span className={`incidence-dot ${zone.incidence}`} aria-hidden="true" />
      <span className="zone-copy">
        <strong>{zone.name}</strong>
        <span>{zone.category} em {neighborhoodName(zone.neighborhoodId)}</span>
        <small>{incidenceLabels[zone.incidence]}</small>
      </span>
    </>
  );
}
