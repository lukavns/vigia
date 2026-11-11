export type RiskLevel = 'critico' | 'alto' | 'moderado' | 'baixo';

export type Incidence = 'low' | 'medium' | 'high' | 'unverified';

export type PriorityLevel = 'alta' | 'media';

/** [sul, oeste, norte, leste] */
export type Bounds = [number, number, number, number];

export interface Neighborhood {
  id: string;
  name: string;
  population: number;
  score: number;
  riskLevel: RiskLevel;
  bounds: Bounds;
}

export interface Zone {
  id: string;
  name: string;
  category: string;
  incidence: Incidence;
  neighborhoodId: string;
  latitude: number;
  longitude: number;
}

export interface Priority {
  neighborhoodId: string;
  incidents: number;
  calls: number;
  reason: string;
}

export type ReportType = 'roubo' | 'furto' | 'conflito' | 'patrulhamento' | 'prevencao';

export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface Report {
  id: string;
  type: ReportType;
  neighborhoodId: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
}
