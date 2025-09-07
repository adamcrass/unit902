// src/pages/Admin.jsx
import React, { useState } from "react";
import styled from "@emotion/styled";
import AdminProductSection from "../components/AdminProductSection";

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AdminHeader = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadow};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const AdminTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AdminSubtitle = styled.p`
  margin: 0.5rem 0 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
`;

const AdminContent = styled.div`
  display: flex;
  min-height: calc(100vh - 120px);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.nav`
  width: 280px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2rem 0;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 1rem 0;
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
  background: ${({ active, theme }) => active ? theme.colors.primarySoft : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textPrimary};
  font-size: 0.95rem;
  font-weight: ${({ active }) => active ? '500' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const sections = [
  { id: 'products', label: 'Products', category: 'Inventory' },
  { id: 'orders', label: 'Orders', category: 'Sales' },
  { id: 'customers', label: 'Customers', category: 'Sales' },
  { id: 'analytics', label: 'Analytics', category: 'Reports' },
  { id: 'settings', label: 'Settings', category: 'System' },
];

const Admin = () => {
  const [activeSection, setActiveSection] = useState('products');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'products':
        return <AdminProductSection />;
      case 'orders':
        return <div>Orders section coming soon...</div>;
      case 'customers':
        return <div>Customers section coming soon...</div>;
      case 'analytics':
        return <div>Analytics section coming soon...</div>;
      case 'settings':
        return <div>Settings section coming soon...</div>;
      default:
        return <AdminProductSection />;
    }
  };

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {});

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Admin Dashboard</AdminTitle>
        <AdminSubtitle>Manage your store inventory, orders, and settings</AdminSubtitle>
      </AdminHeader>
      
      <AdminContent>
        <Sidebar>
          {Object.entries(groupedSections).map(([category, items]) => (
            <SidebarSection key={category}>
              <SectionTitle>{category}</SectionTitle>
              {items.map((section) => (
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
        
        <MainContent>
          {renderActiveSection()}
        </MainContent>
      </AdminContent>
    </AdminContainer>
  );
};

export default Admin;
