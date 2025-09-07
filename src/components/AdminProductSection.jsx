// src/components/AdminProductSection.jsx
import React from "react";
import styled from "@emotion/styled";
import AdminProductForm from "./AdminProductForm";
import AdminProductList from "./AdminProductList";
import AdminTabContainer from "./AdminTabContainer";
import AdminStatsGrid from "./AdminStatsGrid";
import { useAdminProduct } from "../contexts/AdminProductContext";
import { getProductStatsConfig } from "../config/admin";

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



const AdminProductSection = () => {
  const { products, loading, error, stats, addProduct, updateProduct, deleteProduct } = useAdminProduct();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'add', label: 'Add Product' },
    { id: 'manage', label: 'Manage Products' }
  ];

  const renderTabContent = (activeTab) => {
    if (loading) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>;
    }

    if (error) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview': {
        const statsData = getProductStatsConfig(stats);
        
        return (
          <div>
            <AdminStatsGrid stats={statsData} />
          </div>
        );
      }
      case 'add':
        return <AdminProductForm onSubmit={addProduct} />;
      case 'manage':
        return (
          <AdminProductList 
            products={products}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            showActions={true}
          />
        );
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

      <AdminTabContainer 
        tabs={tabs}
        defaultTab="overview"
      >
        {renderTabContent}
      </AdminTabContainer>
    </SectionContainer>
  );
};

export default AdminProductSection;
