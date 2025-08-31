// Legacy EmailSignup - now powered by UltimateEmailSignup
import UltimateEmailSignup from './UltimateEmailSignup';
import { trackButtonClick } from '../lib/analytics';

export default function EmailSignup() {
  const handleSuccess = (data: any) => {
    // Track using existing analytics
    trackButtonClick('email_signup', 'landing_page');
  };

  return (
    <UltimateEmailSignup
      variant="inline"
      includeFirstName={false}
      ctaText="Get Updates"
      source="landing_page"
      onSuccess={handleSuccess}
      showSocialProof={false}
    />
  );
}