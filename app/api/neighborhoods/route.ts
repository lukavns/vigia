import { NextResponse } from 'next/server';
import { mapService } from '../../../server/application/map-service';

export function GET() {
  return NextResponse.json(mapService.neighborhoods());
}
