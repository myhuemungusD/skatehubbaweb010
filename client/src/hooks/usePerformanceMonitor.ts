import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const metrics: PerformanceMetrics = {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
    };

    // Web Vitals observer
    const perfObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // First Contentful Paint
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
          console.log('FCP:', entry.startTime.toFixed(2), 'ms');
        }

        // Largest Contentful Paint
        if (entry.entryType === 'largest-contentful-paint') {
          metrics.lcp = entry.startTime;
          console.log('LCP:', entry.startTime.toFixed(2), 'ms');
        }

        // First Input Delay
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          metrics.fid = fidEntry.processingStart - fidEntry.startTime;
          console.log('FID:', metrics.fid.toFixed(2), 'ms');
        }

        // Cumulative Layout Shift
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          const currentCls = metrics.cls ?? 0;
          const newCls = currentCls + ((entry as any).value || 0);
          metrics.cls = newCls;
          console.log('CLS:', newCls.toFixed(4));
        }
      }
    });

    // Observe performance entries
    try {
      perfObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Browser doesn't support all metrics
      console.warn('Performance monitoring not fully supported');
    }

    // Time to First Byte
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      metrics.ttfb = timing.responseStart - timing.requestStart;
      console.log('TTFB:', metrics.ttfb, 'ms');
    }

    return () => {
      perfObserver.disconnect();
    };
  }, []);
}
