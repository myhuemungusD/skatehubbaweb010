
declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

export const trackEvent = (eventName: string, props?: Record<string, string | number>) => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props });
  }
};

export const analytics = {
  subscribeSubmitted: (email: string) => {
    trackEvent('subscribe_submitted', { email_domain: email.split('@')[1] || 'unknown' });
  },
  
  subscribeSuccess: () => {
    trackEvent('subscribe_success');
  },
  
  ctaClickHero: (ctaText: string) => {
    trackEvent('cta_click_hero', { cta_text: ctaText });
  },
  
  videoPlay: (videoSection: string) => {
    trackEvent('video_play', { video_section: videoSection });
  }
};
