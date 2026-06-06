import { NextResponse } from 'next/server';
import { mapService } from '@/server/application/map-service';

export function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => NextResponse.json(mapService.incidentReports(id)));
}
