import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    healthy: true,
    mode: 'cloud',
    message: 'Hermes is running in cloud-only mode via AI neural link.',
    timestamp: new Date().toISOString(),
  });
}
