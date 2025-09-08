// src/hooks/useProfileMenu.js
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import useClickOutside from "./useClickOutside";

/**
 * Custom hook for profile menu state and handlers
 */
const useProfileMenu = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Close menu when clicking outside
  useClickOutside(menuRef, () => setIsOpen(false), isOpen);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = event => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return {
    user,
    isOpen,
    menuRef,
    triggerRef,
    toggleMenu,
  };
};

export default useProfileMenu;
