import { neighborhoods } from '@/lib/fixtures';
import type { CommunityReport, CreateReportInput, ReportStatus } from '../domain/reports';

const reports: CommunityReport[] = [
  {
    id: 'report-001',
    reportType: 'preco_alto',
    neighborhood: 'Benedito Bentes',
    neighborhoodId: 'benedito-bentes',
    description: 'Moradores relatam aumento fictício de roubos em corredor comercial no período noturno.',
    latitude: -9.559,
    longitude: -35.738,
    status: 'pending_review',
    createdAt: new Date('2026-06-05T21:30:00-03:00').toISOString()
  },
  {
    id: 'report-002',
    reportType: 'falta_alimento',
    neighborhood: 'Centro',
    neighborhoodId: 'centro',
    description: 'Registro fictício de furto em área de grande circulação.',
    latitude: -9.666,
    longitude: -35.735,
    status: 'approved',
    createdAt: new Date('2026-06-04T18:10:00-03:00').toISOString()
  }
];

export const reportRepository = {
  list(status?: string) {
    return status ? reports.filter((report) => report.status === status) : reports;
  },

  create(input: CreateReportInput) {
    const neighborhood = neighborhoods.find((item) => item.id === input.neighborhoodId);
    const report: CommunityReport = {
      id: `report-${crypto.randomUUID()}`,
      reportType: input.reportType,
      neighborhood: neighborhood?.name,
      neighborhoodId: input.neighborhoodId,
      description: input.description,
      latitude: input.latitude,
      longitude: input.longitude,
      photoName: input.photoName,
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };

    reports.unshift(report);
    return report;
  },

  review(id: string, status: ReportStatus) {
    const report = reports.find((item) => item.id === id);

    if (!report) {
      return undefined;
    }

    report.status = status;
    return report;
  },

  metrics() {
    return {
      totalReports: reports.length,
      pendingReports: reports.filter((report) => report.status === 'pending_review').length,
      approvedReports: reports.filter((report) => report.status === 'approved').length,
      rejectedReports: reports.filter((report) => report.status === 'rejected').length
    };
  }
};
