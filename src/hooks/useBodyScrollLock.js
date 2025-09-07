// src/hooks/useBodyScrollLock.js
import { useEffect } from "react";

/**
 * Custom hook to lock/unlock body scroll
 * Useful for modals, overlays, and mobile menus
 * @param {boolean} isLocked - Whether to lock the body scroll
 */
export const useBodyScrollLock = isLocked => {
  useEffect(() => {
    if (isLocked) {
      // Store original values
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Lock scroll
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Cleanup function to restore original values
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isLocked]);
};
