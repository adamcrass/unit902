// src/pages/Admin.jsx
import React from "react";
import styled from "@emotion/styled";
import AdminProductSection from "../components/AdminProductSection";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import UserManagementSection from "../components/UserManagementSection";
import { AdminProductProvider } from "../contexts/AdminProductContext";
import { AdminProvider, useAdmin } from "../contexts/AdminContext";

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AdminContentWrapper = styled.div`
  display: flex;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 1rem;
  }
`;

const AdminContent = () => {
  const { activeSection } = useAdmin();

  const renderActiveSection = () => {
    switch (activeSection) {
      case "products":
        return (
          <AdminProductProvider>
            <AdminProductSection />
          </AdminProductProvider>
        );
      case "orders":
        return <div>Orders section coming soon...</div>;
      case "customers":
        return <div>Customers section coming soon...</div>;
      case "analytics":
        return <div>Analytics section coming soon...</div>;
      case "users":
        return <UserManagementSection />;
      case "settings":
        return <div>Settings section coming soon...</div>;
      default:
        return (
          <AdminProductProvider>
            <AdminProductSection />
          </AdminProductProvider>
        );
    }
  };

  return (
    <AdminContainer>
      <AdminHeader
        title="Admin Dashboard"
        subtitle="Manage your store inventory, orders, and settings"
      />
      <AdminContentWrapper>
        <AdminSidebar />
        <MainContent>{renderActiveSection()}</MainContent>
      </AdminContentWrapper>
    </AdminContainer>
  );
};

const Admin = () => {
  return <AdminContent />;
};

export default Admin;
