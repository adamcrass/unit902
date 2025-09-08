// src/components/AdminSidebar.jsx
import React from "react";
import styled from "@emotion/styled";
import { useAdmin } from "../contexts/AdminContext";

const Sidebar = styled.nav`
  /* Mobile first approach */
  display: none;
  
  /* Desktop styles */
  @media (min-width: 769px) {
    display: block;
    width: 280px;
    background: ${({ theme }) => theme.colors.surface};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    padding: 2rem 0;
    flex-shrink: 0;
    min-height: calc(100vh - 80px);
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 1rem 0;
  padding: 0 1.5rem;
`;

const NavItem = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  text-align: left;
  border: none;
  background: ${({ active, theme }) =>
    active ? theme.colors.primarySoft : "transparent"};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.textPrimary};
  font-size: 0.95rem;
  font-weight: ${({ active }) => (active ? "500" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid
    ${({ active, theme }) => (active ? theme.colors.primary : "transparent")};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AdminSidebar = () => {
  const { sections, activeSection, setActiveSection } = useAdmin();

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {});

  return (
    <Sidebar>
      {Object.entries(groupedSections).map(([category, items]) => (
        <SidebarSection key={category}>
          <SectionTitle>{category}</SectionTitle>
          {items.map(section => (
            <NavItem
              key={section.id}
              active={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </NavItem>
          ))}
        </SidebarSection>
      ))}
    </Sidebar>
  );
};

export default AdminSidebar;
