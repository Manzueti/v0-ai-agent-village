import { NextResponse } from 'next/server';
import { withApiGuard } from '@/lib/api-guard';

async function handleGET() {
  return NextResponse.json({
    healthy: true,
    mode: 'cloud',
    message: 'Hermes is running in cloud-only mode via AI neural link.',
    timestamp: new Date().toISOString(),
  });
}

export const GET = withApiGuard(handleGET);
