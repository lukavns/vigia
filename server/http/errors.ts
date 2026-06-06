import { NextResponse } from 'next/server';

export function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export function notFound(message: string) {
  return NextResponse.json({ message }, { status: 404 });
}
