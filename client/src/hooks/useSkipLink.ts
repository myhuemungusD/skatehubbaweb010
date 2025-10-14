import { useEffect } from 'react';

/**
 * Hook to enable skip links for better keyboard navigation
 * Allows users to skip navigation and jump directly to main content
 */
export function useSkipLink() {
  useEffect(() => {
    // Create skip link if it doesn't exist
    const existingSkipLink = document.getElementById('skip-to-main');
    if (existingSkipLink) return;

    const skipLink = document.createElement('a');
    skipLink.id = 'skip-to-main';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      left: -9999px;
      z-index: 999;
      padding: 1em;
      background-color: #ff6a00;
      color: white;
      text-decoration: none;
      font-weight: 600;
      border-radius: 0 0 4px 0;
    `;

    // Show skip link on focus
    skipLink.addEventListener('focus', () => {
      skipLink.style.left = '0';
      skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.left = '-9999px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    return () => {
      const link = document.getElementById('skip-to-main');
      if (link && document.body.contains(link)) {
        document.body.removeChild(link);
      }
    };
  }, []);
}
