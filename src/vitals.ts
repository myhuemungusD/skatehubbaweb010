import { onLCP, onCLS, onINP } from 'web-vitals';

const send = (metric: any) => {
  // Send Web Vitals to analytics endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
  } else {
    // Fallback for older browsers
    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
      keepalive: true
    }).catch(() => {
      // Silently fail if analytics can't be sent
    });
  }
};

// Track Core Web Vitals
onLCP(send);
onCLS(send); 
onINP(send); // Interaction to Next Paint (replaces FID)