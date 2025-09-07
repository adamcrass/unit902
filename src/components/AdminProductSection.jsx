// src/components/AdminProductSection.jsx
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import AdminProductForm from "./AdminProductForm";
import AdminProductList from "./AdminProductList";
import { productService } from "../services/productService";

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

const TabContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ active }) => active ? '600' : '400'};
  font-size: 0.95rem;
  cursor: pointer;
  border-bottom: 2px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const TabContent = styled.div`
  animation: fadeIn 0.2s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadow};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatChange = styled.div`
  font-size: 0.875rem;
  color: ${({ positive, theme }) => positive ? theme.colors.success : theme.colors.danger};
  margin-top: 0.25rem;
`;

const AdminProductSection = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products from database on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading products from database...');
      const fetchedProducts = await productService.getProducts();
      console.log('Fetched products:', fetchedProducts);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message);
      // Add some sample data for testing if database fails
      setProducts([
        {
          id: 'sample-1',
          name: 'Sample Product (Database Error)',
          description: 'This is sample data shown due to database connection issue',
          price: 2999,
          category: 'Electronics',
          inStock: true,
          quantity: 10,
          createdAt: new Date(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      setError(null);
      const addedProduct = await productService.addProduct({
        ...newProduct,
        createdBy: 'Admin User', // TODO: Get from auth context
        updatedBy: 'Admin User',
      });
      setProducts(prev => [addedProduct, ...prev]);
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw so the form can handle it
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      setError(null);
      const updated = await productService.updateProduct(updatedProduct.id, {
        ...updatedProduct,
        updatedBy: 'Admin User', // TODO: Get from auth context
      });
      setProducts(prev => prev.map(p => 
        p.id === updated.id ? { ...p, ...updated } : p
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setError(null);
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
  };

  const renderTabContent = () => {
    if (loading) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>;
    }

    if (error) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          <p>Error: {error}</p>
          <button onClick={loadProducts} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <StatsGrid>
              <StatCard>
                <StatLabel>Total Products</StatLabel>
                <StatValue>{stats.totalProducts}</StatValue>
                <StatChange positive={true}>+2 this week</StatChange>
              </StatCard>
              <StatCard>
                <StatLabel>In Stock</StatLabel>
                <StatValue>{stats.inStock}</StatValue>
                <StatChange positive={stats.inStock > stats.outOfStock}>
                  {stats.totalProducts > 0 ? ((stats.inStock / stats.totalProducts) * 100).toFixed(0) : 0}% of inventory
                </StatChange>
              </StatCard>
              <StatCard>
                <StatLabel>Out of Stock</StatLabel>
                <StatValue>{stats.outOfStock}</StatValue>
                <StatChange positive={false}>
                  {stats.outOfStock > 0 ? 'Needs attention' : 'All stocked'}
                </StatChange>
              </StatCard>
              <StatCard>
                <StatLabel>Total Value</StatLabel>
                <StatValue>${(stats.totalValue / 100).toFixed(2)}</StatValue>
                <StatChange positive={true}>+12% this month</StatChange>
              </StatCard>
            </StatsGrid>
            <AdminProductList 
              products={products}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        );
      case 'add':
        return <AdminProductForm onSubmit={handleAddProduct} />;
      case 'manage':
        return (
          <AdminProductList 
            products={products}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
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

      <TabContainer>
        <TabList>
          <Tab 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Tab>
          <Tab 
            active={activeTab === 'add'} 
            onClick={() => setActiveTab('add')}
          >
            Add Product
          </Tab>
          <Tab 
            active={activeTab === 'manage'} 
            onClick={() => setActiveTab('manage')}
          >
            Manage Products
          </Tab>
        </TabList>
      </TabContainer>

      <TabContent>
        {renderTabContent()}
      </TabContent>
    </SectionContainer>
  );
};

export default AdminProductSection;
