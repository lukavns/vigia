import { NextResponse } from 'next/server';
import { adminService } from '../../../../../server/application/admin-service';
import { unauthorized } from '../../../../../server/http/errors';

export function GET(request: Request) {
  try {
    return NextResponse.json(adminService.authenticate(request.headers.get('authorization')));
  } catch {
    return unauthorized();
  }
}
