import type { Incidence, PriorityLevel, ReportStatus, ReportType, RiskLevel } from './types';

export const riskLabels: Record<RiskLevel, string> = {
  critico: 'Crítico',
  alto: 'Alto',
  moderado: 'Moderado',
  baixo: 'Baixo'
};

// Mesmos valores de --risk-* em globals.css (o Leaflet precisa da cor em hex).
export const riskColors: Record<RiskLevel, string> = {
  critico: '#8f1d1d',
  alto: '#d9482f',
  moderado: '#c98a12',
  baixo: '#e79a92'
};

export const incidenceLabels: Record<Incidence, string> = {
  low: 'Baixa incidência',
  medium: 'Incidência moderada',
  high: 'Alta incidência',
  unverified: 'Em validação'
};

export const incidenceColors: Record<Incidence, string> = {
  low: riskColors.baixo,
  medium: riskColors.moderado,
  high: riskColors.alto,
  unverified: '#7b8587'
};

export const priorityLabels: Record<PriorityLevel, string> = {
  alta: 'Alta',
  media: 'Média'
};

export const reportTypeLabels: Record<ReportType, string> = {
  roubo: 'Roubo registrado',
  furto: 'Furto registrado',
  conflito: 'Conflito urbano',
  patrulhamento: 'Patrulhamento reduzido',
  prevencao: 'Ação preventiva'
};

export const reportStatusLabels: Record<ReportStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Rejeitada'
};

export function formatPercent(value: number) {
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}
