export type ReportStatus = 'pending_review' | 'approved' | 'rejected';

export interface CommunityReport {
  id: string;
  reportType: string;
  neighborhood?: string;
  neighborhoodId?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  photoName?: string;
  status: ReportStatus;
  createdAt: string;
}

export interface CreateReportInput {
  reportType: string;
  neighborhoodId?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  photoName?: string;
}
