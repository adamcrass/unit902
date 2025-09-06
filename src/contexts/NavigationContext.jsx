// src/contexts/NavigationContext.jsx
import { createContext, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { scrollToElement } from "../utils/smoothScroll";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useActiveSection } from "../hooks/useActiveSection";

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Track active section on home page
  const homeSections = ["about", "contact"];
  const activeSection = useActiveSection(homeSections, 40);

  const isActive = pathname => {
    // For hash links on home page, check if section is active
    if (location.pathname === "/" && pathname.startsWith("#")) {
      const sectionId = pathname.substring(1);
      return activeSection === sectionId;
    }
    // For home route, only active if no section is currently active
    if (pathname === "/" && location.pathname === "/") {
      return !activeSection;
    }
    // For regular routes, check pathname match
    return location.pathname === pathname;
  };

  // Use body scroll lock hook
  useBodyScrollLock(isMobileMenuOpen);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      closeMobileMenu();
    }
  };

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle logout
  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate("/");
      scrollToTop();
    }
    closeMobileMenu();
  };

  // Handle login navigation
  const handleLogin = () => {
    navigate("/login");
    scrollToTop();
    closeMobileMenu();
  };

  // Handle profile navigation
  const handleProfile = () => {
    navigate("/profile");
    scrollToTop();
    closeMobileMenu();
  };

  // Handle navigation clicks (including hash navigation)
  const handleNavigation = href => {
    if (href.startsWith("#")) {
      // Hash navigation - only scroll if we're on the home page
      if (location.pathname === "/") {
        const elementId = href.substring(1);
        scrollToElement(elementId, 40); // offset for header
      } else {
        // Navigate to home page with hash
        navigate(`/${href}`);
        scrollToTop();
      }
    } else {
      // Regular navigation
      navigate(href);
      scrollToTop();
    }
    closeMobileMenu();
  };

  const value = {
    // State
    isMobileMenuOpen,
    user,
    location,

    // Helper functions
    isActive,

    // Event handlers
    toggleMobileMenu,
    closeMobileMenu,
    handleOverlayClick,
    handleLogout,
    handleLogin,
    handleProfile,
    handleNavigation,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
