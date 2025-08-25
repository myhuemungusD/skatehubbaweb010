import { onLCP, onCLS, onINP } from 'web-vitals';
import { trackEvent } from './lib/analytics';

const send = (metric: any) => {
  // Send Web Vitals to Firebase Analytics as custom events
  trackEvent('web_vital', {
    metric_name: metric.name,
    metric_value: Math.round(metric.value),
    metric_rating: metric.rating,
    metric_delta: Math.round(metric.delta),
    metric_id: metric.id,
    navigation_type: metric.navigationType
  });
};

// Track Core Web Vitals
onLCP(send);
onCLS(send); 
onINP(send); // Interaction to Next Paint (replaces FID)