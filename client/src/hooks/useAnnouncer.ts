import { useEffect, useRef } from 'react';

interface AnnouncerOptions {
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
}

/**
 * Hook to announce messages to screen readers using ARIA live regions
 */
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create announcer element if it doesn't exist
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);

  const announce = (message: string, options: AnnouncerOptions = {}) => {
    if (!announcerRef.current) return;

    const {
      politeness = 'polite',
      atomic = true,
      relevant = 'additions'
    } = options;

    announcerRef.current.setAttribute('aria-live', politeness);
    announcerRef.current.setAttribute('aria-atomic', atomic.toString());
    announcerRef.current.setAttribute('aria-relevant', relevant);

    // Clear first to ensure the message is announced even if it's the same
    announcerRef.current.textContent = '';
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
      }
    }, 100);
  };

  return { announce };
}

/**
 * Hook to announce route changes to screen readers
 */
export function useRouteAnnouncer(routeName: string) {
  const { announce } = useAnnouncer();

  useEffect(() => {
    announce(`Navigated to ${routeName} page`, { politeness: 'polite' });
  }, [routeName, announce]);
}
