// src/contexts/AdminContext.jsx
import React, { createContext, useContext, useState } from "react";
import { adminSections, defaultActiveSection } from "../config/admin";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState(defaultActiveSection);

  const value = {
    // State
    sections: adminSections,
    activeSection,
    
    // Actions
    setActiveSection
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
