import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Global Modal Context
 * 
 * Provides global modal state management to track when any modal
 * is open in the application. This is used to:
 * - Hide mobile menu button when modals are open
 * - Manage z-index stacking
 * - Coordinate modal behaviors across the app
 */

const GlobalModalContext = createContext();

export const useGlobalModalContext = () => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error('useGlobalModalContext must be used within a GlobalModalProvider');
  }
  return context;
};

export const GlobalModalProvider = ({ children }) => {
  const [openModals, setOpenModals] = useState(new Set());

  const registerModal = useCallback((modalId) => {
    setOpenModals(prev => new Set([...prev, modalId]));
  }, []);

  const unregisterModal = useCallback((modalId) => {
    setOpenModals(prev => {
      const newSet = new Set(prev);
      newSet.delete(modalId);
      return newSet;
    });
  }, []);

  const isAnyModalOpen = openModals.size > 0;

  const value = {
    isAnyModalOpen,
    registerModal,
    unregisterModal,
    openModalCount: openModals.size,
  };

  return (
    <GlobalModalContext.Provider value={value}>
      {children}
    </GlobalModalContext.Provider>
  );
};

/**
 * Hook to register a modal with the global modal context
 * @param {string} modalId - Unique identifier for the modal
 * @param {boolean} isOpen - Whether the modal is currently open
 */
export const useModalRegistration = (modalId, isOpen) => {
  const { registerModal, unregisterModal } = useGlobalModalContext();

  React.useEffect(() => {
    if (isOpen) {
      registerModal(modalId);
    } else {
      unregisterModal(modalId);
    }

    // Cleanup on unmount
    return () => {
      unregisterModal(modalId);
    };
  }, [isOpen, modalId, registerModal, unregisterModal]);
};
