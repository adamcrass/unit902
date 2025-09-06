// src/utils/smoothScroll.js

/**
 * Smoothly scrolls to an element with the given ID
 * @param {string} elementId - The ID of the element to scroll to (without #)
 * @param {number} offset - Optional offset from the top (default: 80px for header)
 */
export const scrollToElement = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Handles hash navigation - scrolls to element if hash exists in URL
 * @param {string} hash - The hash from window.location.hash or a custom hash
 * @param {number} offset - Optional offset from the top
 */
export const handleHashNavigation = (hash, offset = 80) => {
  if (hash && hash.startsWith('#')) {
    const elementId = hash.substring(1); // Remove the # symbol
    scrollToElement(elementId, offset);
  }
};

/**
 * Sets up hash navigation listener for the current page
 * Automatically scrolls to hash on page load and hash changes
 */
export const setupHashNavigation = (offset = 80) => {
  // Handle initial hash on page load
  const handleInitialHash = () => {
    if (window.location.hash) {
      // Small delay to ensure page is fully rendered
      setTimeout(() => {
        handleHashNavigation(window.location.hash, offset);
      }, 100);
    }
  };

  // Handle hash changes (when user clicks hash links)
  const handleHashChange = () => {
    handleHashNavigation(window.location.hash, offset);
  };

  // Set up listeners
  window.addEventListener('load', handleInitialHash);
  window.addEventListener('hashchange', handleHashChange);

  // Cleanup function
  return () => {
    window.removeEventListener('load', handleInitialHash);
    window.removeEventListener('hashchange', handleHashChange);
  };
};
