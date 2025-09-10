import { useEffect } from 'react';

/**
 * Scroll Lock Utility
 *
 * Provides reusable functions to lock and unlock body scrolling
 * when modals, overlays, or other UI elements need to prevent
 * background scrolling on mobile and desktop.
 */

let scrollPosition = 0;
let isLocked = false;

/**
 * Locks body scrolling and preserves current scroll position
 */
export const lockScroll = () => {
  if (isLocked) return;

  // Store current scroll position
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // Apply styles to prevent scrolling
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.overflow = 'hidden';

  // Prevent scrolling on mobile devices
  document.body.style.touchAction = 'none';

  isLocked = true;
};

/**
 * Unlocks body scrolling and restores previous scroll position
 */
export const unlockScroll = () => {
  if (!isLocked) return;

  // Remove styles
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';

  // Restore scroll position
  window.scrollTo(0, scrollPosition);

  isLocked = false;
};

/**
 * Custom hook for React components to manage scroll locking
 * @param {boolean} shouldLock - Whether scrolling should be locked
 */
export const useScrollLock = (shouldLock) => {
  useEffect(() => {
    if (shouldLock) {
      lockScroll();
    } else {
      unlockScroll();
    }

    // Cleanup on unmount
    return () => {
      unlockScroll();
    };
  }, [shouldLock]);
};

/**
 * Simple function to set scroll lock state (for compatibility with existing code)
 * @param {boolean} shouldLock - Whether scrolling should be locked
 */
export const setScrollLock = (shouldLock) => {
  if (shouldLock) {
    lockScroll();
  } else {
    unlockScroll();
  }
};

