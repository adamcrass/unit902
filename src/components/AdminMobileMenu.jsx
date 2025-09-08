// src/components/AdminMobileMenu.jsx
import React from "react";
import styled from "@emotion/styled";
import { useAdmin } from "../contexts/AdminContext";

// Mobile menu button with hamburger animation
const MobileMenuButtonContainer = styled.button`
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: ${({ theme }) => theme.zIndices.mobileMenu};
  padding: 0.5rem;

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Animated hamburger lines
const HamburgerLine = styled.span`
  display: block;
  width: 20px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: absolute;

  &:nth-of-type(1) {
    top: ${({ isOpen }) => (isOpen ? "50%" : "calc(50% - 6px)")};
    transform: ${({ isOpen }) =>
      isOpen ? "translateY(-50%) rotate(45deg)" : "translateY(-50%) rotate(0)"};
  }

  &:nth-of-type(2) {
    top: 50%;
    transform: translateY(-50%);
    opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
    width: ${({ isOpen }) => (isOpen ? "0" : "20px")};
  }

  &:nth-of-type(3) {
    top: ${({ isOpen }) => (isOpen ? "50%" : "calc(50% + 6px)")};
    transform: ${({ isOpen }) =>
      isOpen
        ? "translateY(-50%) rotate(-45deg)"
        : "translateY(-50%) rotate(0)"};
  }
`;

const AdminMobileMenuButton = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useAdmin();

  return (
    <MobileMenuButtonContainer
      onClick={toggleMobileMenu}
      aria-expanded={isMobileMenuOpen}
      aria-controls="admin-mobile-navigation"
      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
    >
      <HamburgerLine isOpen={isMobileMenuOpen} />
      <HamburgerLine isOpen={isMobileMenuOpen} />
      <HamburgerLine isOpen={isMobileMenuOpen} />
    </MobileMenuButtonContainer>
  );
};

const MobileMenuOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.surface};
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  @media (max-width: 768px) {
    display: flex;
    align-content: flex-start;
    justify-content: flex-start;
    opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
    visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  }
`;

const MobileMenuPanel = styled.nav`
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: center;
`;

const MobileMenuHeader = styled.div`
  margin-bottom: 3rem;
`;

const MobileMenuTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const MobileMenuSection = styled.div`
  margin-bottom: 3rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const MobileSectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 1.5rem 0;
`;

const MobileNavItem = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  text-align: left;
  border: none;
  background: ${({ active, theme }) =>
    active ? theme.colors.primarySoft : "transparent"};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.textPrimary};
  font-size: 1.5rem;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  /* border: 2px solid
    ${({ active, theme }) => (active ? theme.colors.primary : "transparent")};
     */

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AdminMobileMenu = () => {
  const {
    sections,
    activeSection,
    setActiveSection,
    isMobileMenuOpen,
    closeMobileMenu,
  } = useAdmin();

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {});

  const handleSectionChange = sectionId => {
    setActiveSection(sectionId);
    closeMobileMenu();
  };

  return (
    <>
      <AdminMobileMenuButton />

      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClick={closeMobileMenu}>
        <MobileMenuPanel>
          <MobileMenuHeader>
            <MobileMenuTitle>Admin Menu</MobileMenuTitle>
          </MobileMenuHeader>

          {Object.entries(groupedSections).map(([category, items]) => (
            <MobileMenuSection key={category}>
              <MobileSectionTitle>{category}</MobileSectionTitle>
              {items.map(section => (
                <MobileNavItem
                  key={section.id}
                  active={activeSection === section.id}
                  onClick={() => handleSectionChange(section.id)}
                >
                  {section.label}
                </MobileNavItem>
              ))}
            </MobileMenuSection>
          ))}
        </MobileMenuPanel>
      </MobileMenuOverlay>
    </>
  );
};

export default AdminMobileMenu;
