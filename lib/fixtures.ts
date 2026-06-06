import type { IncidentPoint, MappingPriority, Neighborhood, Overview } from './types';

const regionGeometry = (south: number, west: number, north: number, east: number) =>
  JSON.stringify({
    type: 'Polygon',
    coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]]
  });

export const overview: Overview = {
  totalNeighborhoods: 6,
  totalFoodPoints: 12,
  highRiskNeighborhoods: 4,
  topRiskNeighborhood: 'Benedito Bentes'
};

export const neighborhoods: Neighborhood[] = [
  {
    id: 'benedito-bentes',
    name: 'Benedito Bentes',
    population: 88000,
    score: 82.4,
    riskLevel: 'critico',
    geometry: regionGeometry(-9.574, -35.765, -9.535, -35.715)
  },
  {
    id: 'jacintinho',
    name: 'Jacintinho',
    population: 72000,
    score: 74.8,
    riskLevel: 'alto',
    geometry: regionGeometry(-9.636, -35.746, -9.603, -35.710)
  },
  {
    id: 'tabuleiro-do-martins',
    name: 'Tabuleiro do Martins',
    population: 65000,
    score: 67.3,
    riskLevel: 'alto',
    geometry: regionGeometry(-9.617, -35.790, -9.575, -35.742)
  },
  {
    id: 'centro',
    name: 'Centro',
    population: 26000,
    score: 58.6,
    riskLevel: 'alto',
    geometry: regionGeometry(-9.678, -35.748, -9.648, -35.720)
  },
  {
    id: 'vergel-do-lago',
    name: 'Vergel do Lago',
    population: 31000,
    score: 43.9,
    riskLevel: 'moderado',
    geometry: regionGeometry(-9.686, -35.775, -9.651, -35.741)
  },
  {
    id: 'ponta-verde',
    name: 'Ponta Verde',
    population: 24000,
    score: 22.7,
    riskLevel: 'baixo',
    geometry: regionGeometry(-9.670, -35.714, -9.646, -35.690)
  }
];

export const incidentPoints: IncidentPoint[] = [
  {
    id: 'patrulhamento-ponta-verde',
    name: 'Patrulhamento Ponta Verde',
    category: 'Ocorrências leves',
    profile: 'healthy',
    neighborhood: 'Ponta Verde',
    longitude: -35.704,
    latitude: -9.658,
    source: 'simulated'
  },
  {
    id: 'benedito-setor-a',
    name: 'Benedito Bentes - Setor A',
    category: 'Furtos e roubos',
    profile: 'ultra_processed_predominant',
    neighborhood: 'Benedito Bentes',
    longitude: -35.738,
    latitude: -9.559,
    source: 'simulated'
  },
  {
    id: 'tabuleiro-corredor-comercial',
    name: 'Tabuleiro - corredor comercial',
    category: 'Ocorrências patrimoniais',
    profile: 'mixed',
    neighborhood: 'Tabuleiro do Martins',
    longitude: -35.769,
    latitude: -9.594,
    source: 'simulated'
  },
  {
    id: 'jacintinho-incidencia',
    name: 'Jacintinho - área de maior incidência',
    category: 'Roubos e conflitos urbanos',
    profile: 'ultra_processed_predominant',
    neighborhood: 'Jacintinho',
    longitude: -35.733,
    latitude: -9.623,
    source: 'simulated'
  },
  {
    id: 'centro-fluxo-noturno',
    name: 'Centro - fluxo noturno',
    category: 'Furtos em área comercial',
    profile: 'mixed',
    neighborhood: 'Centro',
    longitude: -35.735,
    latitude: -9.666,
    source: 'simulated'
  },
  {
    id: 'vergel-monitoramento',
    name: 'Vergel do Lago - monitoramento comunitário',
    category: 'Ocorrências moderadas',
    profile: 'unknown',
    neighborhood: 'Vergel do Lago',
    longitude: -35.759,
    latitude: -9.668,
    source: 'simulated'
  }
];

export const mappingPriorities: MappingPriority[] = [
  {
    neighborhood: 'Benedito Bentes',
    population: 88000,
    priorityScore: 82.4,
    priorityLevel: 'alta',
    foodPoints: 34,
    reports: 19,
    transportPoints: 8,
    socialAssistanceUnits: 3,
    licensingRecords: 42,
    reason: 'Maior percentual fictício de ocorrências patrimoniais e chamados noturnos.'
  },
  {
    neighborhood: 'Jacintinho',
    population: 72000,
    priorityScore: 74.8,
    priorityLevel: 'alta',
    foodPoints: 28,
    reports: 15,
    transportPoints: 6,
    socialAssistanceUnits: 2,
    licensingRecords: 37,
    reason: 'Concentração simulada de roubos em vias de grande circulação.'
  },
  {
    neighborhood: 'Centro',
    population: 26000,
    priorityScore: 58.6,
    priorityLevel: 'media',
    foodPoints: 21,
    reports: 11,
    transportPoints: 12,
    socialAssistanceUnits: 2,
    licensingRecords: 54,
    reason: 'Oscilação fictícia de furtos em horários de pico e fluxo comercial.'
  }
];
