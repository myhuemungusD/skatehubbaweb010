import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  handler: (e: KeyboardEvent) => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const modifiersMatch =
          (shortcut.ctrlKey === undefined || shortcut.ctrlKey === e.ctrlKey) &&
          (shortcut.altKey === undefined || shortcut.altKey === e.altKey) &&
          (shortcut.shiftKey === undefined || shortcut.shiftKey === e.shiftKey) &&
          (shortcut.metaKey === undefined || shortcut.metaKey === e.metaKey);

        if (e.key === shortcut.key && modifiersMatch) {
          // Don't prevent default if user is typing in an input
          if (
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement
          ) {
            return;
          }
          
          e.preventDefault();
          shortcut.handler(e);
        }
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);
}

// Focus trap for modals and dialogs
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        container.dispatchEvent(new CustomEvent('closerequest'));
      }
    };

    container.addEventListener('keydown', handleTab as EventListener);
    container.addEventListener('keydown', handleEscape as EventListener);
    
    // Focus first element when trap activates
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTab as EventListener);
      container.removeEventListener('keydown', handleEscape as EventListener);
    };
  }, [containerRef, isActive]);
}
