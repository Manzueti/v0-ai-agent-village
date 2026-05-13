'use client';

import { useEffect } from 'react';
import { initializeFaro, getWebInstrumentations } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

export default function FaroInitializer() {
  useEffect(() => {
    // Only initialize if environment variables are present
    const faroUrl = process.env.NEXT_PUBLIC_FARO_URL;
    const faroAppId = process.env.NEXT_PUBLIC_FARO_APP_ID;

    if (faroUrl && faroAppId) {
      initializeFaro({
        url: faroUrl,
        app: {
          name: 'cyber-empire',
          id: faroAppId,
          version: '0.2.0',
        },
        instrumentations: [
          ...getWebInstrumentations(),
          new TracingInstrumentation(),
        ],
      });
    }
  }, []);

  return null;
}
