// src/hooks/useUserDisplay.js
import { useMemo } from "react";

/**
 * Custom hook for user display utilities
 * @param {Object} user - User object from auth context
 */
const useUserDisplay = (user) => {
  const getInitials = useMemo(() => {
    return (name) => {
      if (!name) return "U";
      return name
        .split(" ")
        .map(part => part.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };
  }, []);

  const displayName = useMemo(() => {
    return user?.displayName || user?.email?.split("@")[0] || "User";
  }, [user?.displayName, user?.email]);

  const userRole = useMemo(() => {
    return user?.role || "Member";
  }, [user?.role]);

  const initials = useMemo(() => {
    return getInitials(displayName);
  }, [getInitials, displayName]);

  const isAdmin = useMemo(() => {
    return user?.role === "admin" || user?.role === "super_admin";
  }, [user?.role]);

  return {
    displayName,
    userRole,
    initials,
    isAdmin,
    getInitials
  };
};

export default useUserDisplay;
