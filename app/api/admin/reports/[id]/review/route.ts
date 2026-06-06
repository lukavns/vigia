import { NextResponse } from 'next/server';
import { adminService } from '../../../../../../server/application/admin-service';
import { reportService } from '../../../../../../server/application/report-service';
import { badRequest, notFound, unauthorized } from '../../../../../../server/http/errors';
import type { ReportStatus } from '../../../../../../server/domain/reports';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    adminService.authenticate(request.headers.get('authorization'));
  } catch {
    return unauthorized();
  }

  const body = await request.json().catch(() => ({})) as { status?: ReportStatus };

  if (body.status !== 'approved' && body.status !== 'rejected') {
    return badRequest('status must be approved or rejected');
  }

  try {
    const { id } = await params;
    return NextResponse.json(reportService.review(id, body.status));
  } catch {
    return notFound('report not found');
  }
}
