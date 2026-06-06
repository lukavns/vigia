export interface Overview {
  totalNeighborhoods: number;
  totalFoodPoints: number;
  highRiskNeighborhoods: number;
  topRiskNeighborhood: string;
}

export interface Neighborhood {
  id?: string;
  name: string;
  population: number;
  geometry?: string;
  score: number;
  riskLevel: RiskLevel;
}

export type RiskLevel = 'critico' | 'alto' | 'moderado' | 'medio' | 'baixo' | 'sem_dados';

export interface IncidentPoint {
  id?: string;
  name: string;
  category: string;
  profile: IncidentProfile;
  addressText?: string;
  neighborhood: string;
  longitude?: number;
  latitude?: number;
  source: string;
}

export type IncidentProfile = 'healthy' | 'mixed' | 'ultra_processed_predominant' | 'unknown';

export interface PublicCommunityReport {
  id: string;
  reportType: string;
  neighborhood?: string;
  description?: string;
  createdAt: string;
}

export interface MappingPriority {
  neighborhood: string;
  population: number;
  priorityScore: number;
  priorityLevel: 'alta' | 'media' | 'baixa';
  foodPoints: number;
  reports: number;
  transportPoints: number;
  socialAssistanceUnits: number;
  licensingRecords: number;
  reason: string;
}

export interface AdminUser {
  email: string;
  role: string;
}

export interface AdminDashboard {
  totalReports: number;
  pendingReports: number;
  approvedReports: number;
  rejectedReports: number;
  totalNeighborhoods: number;
  totalFoodPoints: number;
}

export interface AdminCommunityReport {
  id: string;
  reportType: string;
  neighborhood?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  status: string;
  createdAt: string;
}
