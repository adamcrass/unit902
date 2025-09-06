// src/contexts/NavigationContext.jsx
import { createContext, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { scrollToElement } from "../utils/smoothScroll";

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

  const isActive = pathname => location.pathname === pathname;

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

  // Handle logout
  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate("/");
    }
    closeMobileMenu();
  };

  // Handle login navigation
  const handleLogin = () => {
    navigate("/login");
    closeMobileMenu();
  };

  // Handle profile navigation
  const handleProfile = () => {
    navigate("/profile");
    closeMobileMenu();
  };

  // Handle navigation clicks (including hash navigation)
  const handleNavigation = href => {
    if (href.startsWith("#")) {
      // Hash navigation - only scroll if we're on the home page
      if (location.pathname === "/") {
        const elementId = href.substring(1);
        scrollToElement(elementId, 100); // 100px offset for header
      } else {
        // Navigate to home page with hash
        navigate(`/${href}`);
      }
    } else {
      // Regular navigation
      navigate(href);
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
