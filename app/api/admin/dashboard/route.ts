import { NextResponse } from 'next/server';
import { adminService } from '../../../../server/application/admin-service';
import { unauthorized } from '../../../../server/http/errors';

export function GET(request: Request) {
  try {
    adminService.authenticate(request.headers.get('authorization'));
    return NextResponse.json(adminService.dashboard());
  } catch {
    return unauthorized();
  }
}
