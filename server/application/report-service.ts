import { reportRepository } from '../repositories/report-repository';
import type { CreateReportInput, ReportStatus } from '../domain/reports';

export const reportService = {
  list(status?: string) {
    return reportRepository.list(status);
  },

  create(input: CreateReportInput) {
    if (!input.reportType) {
      throw new Error('report_type_required');
    }

    return reportRepository.create(input);
  },

  review(id: string, status: ReportStatus) {
    if (status !== 'approved' && status !== 'rejected') {
      throw new Error('invalid_status');
    }

    const report = reportRepository.review(id, status);

    if (!report) {
      throw new Error('report_not_found');
    }

    return report;
  },

  metrics() {
    return reportRepository.metrics();
  }
};
