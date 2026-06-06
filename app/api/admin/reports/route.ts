import { NextResponse } from 'next/server';
import { adminService } from '../../../../server/application/admin-service';
import { reportService } from '../../../../server/application/report-service';
import { unauthorized } from '../../../../server/http/errors';

export function GET(request: Request) {
  try {
    adminService.authenticate(request.headers.get('authorization'));
    const status = new URL(request.url).searchParams.get('status') ?? undefined;
    return NextResponse.json(reportService.list(status));
  } catch {
    return unauthorized();
  }
}
