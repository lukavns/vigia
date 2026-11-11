import type { Neighborhood, Priority, PriorityLevel, Report, Zone } from './types';

// Todos os números abaixo são fictícios e servem só para a demonstração.

export const neighborhoods: Neighborhood[] = [
  {
    id: 'benedito-bentes',
    name: 'Benedito Bentes',
    population: 88000,
    score: 82.4,
    riskLevel: 'critico',
    bounds: [-9.574, -35.765, -9.535, -35.715]
  },
  {
    id: 'jacintinho',
    name: 'Jacintinho',
    population: 72000,
    score: 74.8,
    riskLevel: 'alto',
    bounds: [-9.636, -35.746, -9.603, -35.71]
  },
  {
    id: 'tabuleiro-do-martins',
    name: 'Tabuleiro do Martins',
    population: 65000,
    score: 67.3,
    riskLevel: 'alto',
    bounds: [-9.617, -35.79, -9.575, -35.742]
  },
  {
    id: 'centro',
    name: 'Centro',
    population: 26000,
    score: 58.6,
    riskLevel: 'alto',
    bounds: [-9.678, -35.748, -9.648, -35.72]
  },
  {
    id: 'vergel-do-lago',
    name: 'Vergel do Lago',
    population: 31000,
    score: 43.9,
    riskLevel: 'moderado',
    bounds: [-9.686, -35.775, -9.651, -35.741]
  },
  {
    id: 'ponta-verde',
    name: 'Ponta Verde',
    population: 24000,
    score: 22.7,
    riskLevel: 'baixo',
    bounds: [-9.67, -35.714, -9.646, -35.69]
  }
];

export const zones: Zone[] = [
  {
    id: 'benedito-setor-a',
    name: 'Benedito Bentes - Setor A',
    category: 'Furtos e roubos',
    incidence: 'high',
    neighborhoodId: 'benedito-bentes',
    latitude: -9.559,
    longitude: -35.738
  },
  {
    id: 'jacintinho-incidencia',
    name: 'Jacintinho - área de maior incidência',
    category: 'Roubos e conflitos urbanos',
    incidence: 'high',
    neighborhoodId: 'jacintinho',
    latitude: -9.623,
    longitude: -35.733
  },
  {
    id: 'tabuleiro-corredor-comercial',
    name: 'Tabuleiro - corredor comercial',
    category: 'Ocorrências patrimoniais',
    incidence: 'medium',
    neighborhoodId: 'tabuleiro-do-martins',
    latitude: -9.594,
    longitude: -35.769
  },
  {
    id: 'centro-fluxo-noturno',
    name: 'Centro - fluxo noturno',
    category: 'Furtos em área comercial',
    incidence: 'medium',
    neighborhoodId: 'centro',
    latitude: -9.666,
    longitude: -35.735
  },
  {
    id: 'vergel-monitoramento',
    name: 'Vergel do Lago - monitoramento comunitário',
    category: 'Ocorrências moderadas',
    incidence: 'unverified',
    neighborhoodId: 'vergel-do-lago',
    latitude: -9.668,
    longitude: -35.759
  },
  {
    id: 'patrulhamento-ponta-verde',
    name: 'Patrulhamento Ponta Verde',
    category: 'Ocorrências leves',
    incidence: 'low',
    neighborhoodId: 'ponta-verde',
    latitude: -9.658,
    longitude: -35.704
  }
];

export const priorities: Priority[] = [
  {
    neighborhoodId: 'benedito-bentes',
    incidents: 34,
    calls: 19,
    reason: 'Maior percentual de ocorrências patrimoniais e chamados noturnos.'
  },
  {
    neighborhoodId: 'jacintinho',
    incidents: 28,
    calls: 15,
    reason: 'Concentração de roubos em vias de grande circulação.'
  },
  {
    neighborhoodId: 'tabuleiro-do-martins',
    incidents: 24,
    calls: 13,
    reason: 'Ocorrências recorrentes no corredor comercial e no entorno dos terminais.'
  },
  {
    neighborhoodId: 'centro',
    incidents: 21,
    calls: 11,
    reason: 'Oscilação de furtos em horários de pico e fluxo comercial.'
  }
];

export const seedReports: Report[] = [
  {
    id: 'r-001',
    type: 'roubo',
    neighborhoodId: 'benedito-bentes',
    description: 'Moradores relatam aumento de roubos em corredor comercial no período noturno.',
    status: 'pending',
    createdAt: '2026-06-05T21:30:00-03:00'
  },
  {
    id: 'r-002',
    type: 'conflito',
    neighborhoodId: 'jacintinho',
    description: 'Briga generalizada na saída de um evento, com acionamento da guarda municipal.',
    status: 'pending',
    createdAt: '2026-06-05T23:05:00-03:00'
  },
  {
    id: 'r-003',
    type: 'patrulhamento',
    neighborhoodId: 'tabuleiro-do-martins',
    description: 'Comerciantes apontam menos rondas no corredor comercial depois das 20h.',
    status: 'pending',
    createdAt: '2026-06-05T09:40:00-03:00'
  },
  {
    id: 'r-004',
    type: 'furto',
    neighborhoodId: 'centro',
    description: 'Furto de celular em área de grande circulação próxima ao comércio.',
    status: 'approved',
    createdAt: '2026-06-04T18:10:00-03:00'
  },
  {
    id: 'r-005',
    type: 'prevencao',
    neighborhoodId: 'ponta-verde',
    description: 'Reunião do conselho comunitário de segurança com reforço de iluminação na orla.',
    status: 'approved',
    createdAt: '2026-06-03T19:00:00-03:00'
  },
  {
    id: 'r-006',
    type: 'furto',
    neighborhoodId: 'vergel-do-lago',
    description: 'Relato duplicado, sem local nem horário informados.',
    status: 'rejected',
    createdAt: '2026-06-02T14:20:00-03:00'
  }
];

const byId = new Map(neighborhoods.map((neighborhood) => [neighborhood.id, neighborhood]));

export function neighborhoodName(id: string) {
  return byId.get(id)?.name ?? 'Bairro não informado';
}

export function getNeighborhood(id: string) {
  return byId.get(id);
}

export function priorityLevel(score: number): PriorityLevel {
  return score >= 70 ? 'alta' : 'media';
}

const alertLevels = neighborhoods.filter((neighborhood) =>
  neighborhood.riskLevel === 'critico' || neighborhood.riskLevel === 'alto'
);

export const overview = {
  neighborhoods: neighborhoods.length,
  zones: zones.length,
  onAlert: alertLevels.length,
  topRisk: [...neighborhoods].sort((a, b) => b.score - a.score)[0].name
};
