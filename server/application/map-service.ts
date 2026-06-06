import { incidentPoints, mappingPriorities, neighborhoods, overview } from '../../lib/fixtures';

export const mapService = {
  overview() {
    return overview;
  },

  neighborhoods() {
    return neighborhoods;
  },

  incidents() {
    return incidentPoints;
  },

  incidentReports(pointId: string) {
    const point = incidentPoints.find((item) => item.id === pointId);

    if (!point) {
      return [];
    }

    return [
      {
        id: `${point.id}-sample-report`,
        reportType: point.profile === 'ultra_processed_predominant' ? 'preco_alto' : 'falta_alimento',
        neighborhood: point.neighborhood,
        description: `Ocorrência simulada vinculada a ${point.name}.`,
        createdAt: new Date().toISOString()
      }
    ];
  },

  mappingPriorities() {
    return mappingPriorities;
  }
};
