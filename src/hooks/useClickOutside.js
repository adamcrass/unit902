// src/hooks/useClickOutside.js
import { useEffect } from "react";

/**
 * Custom hook to handle clicking outside of a referenced element
 * @param {Object} ref - React ref object for the element
 * @param {Function} callback - Function to call when clicking outside
 * @param {boolean} isActive - Whether the hook should be active
 */
const useClickOutside = (ref, callback, isActive = true) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [ref, callback, isActive]);
};

export default useClickOutside;
