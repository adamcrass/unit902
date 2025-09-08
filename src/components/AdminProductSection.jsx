// src/components/AdminProductSection.jsx
import React from "react";
import styled from "@emotion/styled";
import AdminProductForm from "./AdminProductForm";
import AdminProductList from "./AdminProductList";
import AdminTabContainer from "./AdminTabContainer";
import AdminStatsGrid from "./AdminStatsGrid";
import { useAdminProduct } from "../contexts/AdminProductContext";

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 0.5rem 0;
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0;
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorMessage = styled.p`
  margin: 0 0 1rem 0;
`;

const RetryButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const OverviewContainer = styled.div`
  /* Container for overview content */
`;

const AdminProductSection = () => {
  const { loading, error, addProduct } = useAdminProduct();

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "add", label: "Add Product" },
    { id: "manage", label: "Manage Products" },
  ];

  const renderTabContent = activeTab => {
    if (loading) {
      return <LoadingContainer>Loading products...</LoadingContainer>;
    }

    if (error) {
      return (
        <ErrorContainer>
          <ErrorMessage>Error: {error}</ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Retry
          </RetryButton>
        </ErrorContainer>
      );
    }

    switch (activeTab) {
      case "overview": {
        return (
          <OverviewContainer>
            <AdminStatsGrid />
          </OverviewContainer>
        );
      }
      case "add":
        return <AdminProductForm onSubmit={addProduct} />;
      case "manage":
        return <AdminProductList showActions={true} />;
      default:
        return null;
    }
  };

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Product Management</SectionTitle>
        <SectionDescription>
          Add new products, manage inventory, and track product performance
        </SectionDescription>
      </SectionHeader>

      <AdminTabContainer tabs={tabs} defaultTab="overview">
        {renderTabContent}
      </AdminTabContainer>
    </SectionContainer>
  );
};

export default AdminProductSection;
