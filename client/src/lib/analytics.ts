import { logEvent } from "firebase/analytics";
import { analytics as firebaseAnalytics } from "./firebase";
import { env } from '../config/env';

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (env.DEV) {
    console.log(`[Analytics] ${eventName}`, parameters);
    return;
  }
  
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, eventName, parameters);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
};

// Predefined event tracking functions
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href
  });
};

export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location || window.location.pathname
  });
};

export const trackDonation = (amount: number, method: string) => {
  trackEvent('donation_initiated', {
    value: amount,
    currency: 'USD',
    payment_method: method
  });
};

export const trackSignup = (method: string = 'email') => {
  trackEvent('sign_up', {
    method: method
  });
};

export const trackAppDemo = (source: string) => {
  trackEvent('app_demo_click', {
    source: source
  });
};

// Legacy analytics functions for backward compatibility
export const analytics = {
  subscribeSubmitted: (email: string) => {
    trackSignup('email');
    trackEvent('subscribe_submitted', { email_domain: email.split('@')[1] || 'unknown' });
  },
  
  subscribeSuccess: () => {
    trackEvent('subscribe_success');
  },
  
  ctaClickHero: (ctaText: string) => {
    trackButtonClick('hero_cta', 'hero_section');
    trackEvent('cta_click_hero', { cta_text: ctaText });
  },
  
  videoPlay: (videoSection: string) => {
    trackEvent('video_play', { video_section: videoSection });
  }
};