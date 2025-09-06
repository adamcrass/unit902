// src/hooks/useActiveSection.js
import { useState, useEffect } from "react";

/**
 * Custom hook to detect which section is currently in the viewport
 * @param {Array} sectionIds - Array of section IDs to track
 * @param {number} offset - Offset from top to consider section active (default: 100px for header)
 * @returns {string} - The ID of the currently active section
 */
export const useActiveSection = (sectionIds = [], offset = 100) => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      // Find the section that's currently in view
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        const element = document.getElementById(sectionId);
        
        if (element) {
          const { offsetTop } = element;
          
          if (scrollPosition >= offsetTop) {
            setActiveSection(sectionId);
            break;
          }
        }
      }

      // If we're at the very top, no section should be active
      if (window.scrollY < offset) {
        setActiveSection("");
      }
    };

    // Set initial active section
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds, offset]);

  return activeSection;
};
