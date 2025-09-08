// src/components/admin/ProductList.jsx
import React, { useState } from "react";
import styled from "@emotion/styled";
import { useAdminProduct } from "../contexts/AdminProductContext";

const ListContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px ${({ theme }) => theme.colors.shadow};
`;

const ListHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.gray100};
`;

const ListTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 0.5rem 0;
`;

const ListSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  margin: 0;
`;

const SearchAndFilter = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primarySoft};
  }
  
  @media (max-width: 768px) {
    min-width: auto;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  background: ${({ theme }) => theme.colors.surface};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.gray100};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  vertical-align: middle;
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProductName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.25rem;
`;

const ProductDescription = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${({ status, theme }) => {
    if (status === 'in-stock') {
      return `
        background: ${theme.colors.success}20;
        color: ${theme.colors.success};
      `;
    }
    return `
      background: ${theme.colors.danger}20;
      color: ${theme.colors.danger};
    `;
  }}
`;

const ActionButton = styled.button`
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
  
  ${({ variant, theme }) => {
    if (variant === 'edit') {
      return `
        background: ${theme.colors.info}20;
        color: ${theme.colors.info};
        
        &:hover {
          background: ${theme.colors.info}30;
        }
      `;
    }
    if (variant === 'delete') {
      return `
        background: ${theme.colors.danger}20;
        color: ${theme.colors.danger};
        
        &:hover {
          background: ${theme.colors.danger}30;
        }
      `;
    }
    return `
      background: ${theme.colors.gray200};
      color: ${theme.colors.textPrimary};
      
      &:hover {
        background: ${theme.colors.gray300};
      }
    `;
  }}
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyStateTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 0.5rem 0;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 0.95rem;
`;

const ProductList = ({ showActions = false }) => {
  const { products, deleteProduct } = useAdminProduct();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'in-stock' && product.inStock) ||
                         (filterStatus === 'out-of-stock' && !product.inStock);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  const formatPrice = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleEdit = (product) => {
    // TODO: Implement edit functionality - open modal or navigate to edit form
    // For now, we could use updateProduct when edit modal is implemented
    alert(`Edit functionality for "${product.name}" coming soon!`);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  if (products.length === 0) {
    return (
      <ListContainer>
        <ListHeader>
          <ListTitle>Product Inventory</ListTitle>
          <ListSubtitle>No products found</ListSubtitle>
        </ListHeader>
        <EmptyState>
          <EmptyStateTitle>No products yet</EmptyStateTitle>
          <EmptyStateText>
            Start by adding your first product to build your inventory.
          </EmptyStateText>
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Product Inventory</ListTitle>
        <ListSubtitle>
          {filteredProducts.length} of {products.length} products
        </ListSubtitle>
      </ListHeader>
      
      <SearchAndFilter>
        <SearchInput
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FilterSelect
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </FilterSelect>
        
        <FilterSelect
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </FilterSelect>
      </SearchAndFilter>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Stock</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            {showActions && <TableHeaderCell>Actions</TableHeaderCell>}
          </TableRow>
        </TableHeader>
        <tbody>
          {filteredProducts.map(product => (
            <TableRow key={product.id}>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {product.image && (
                    <ProductImage 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <ProductName>{product.name}</ProductName>
                    <ProductDescription>{product.description}</ProductDescription>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>{product.category}</div>
                {product.subcategory && (
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {product.subcategory}
                  </div>
                )}
              </TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <StatusBadge status={product.inStock ? 'in-stock' : 'out-of-stock'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </StatusBadge>
              </TableCell>
              {showActions && (
                <TableCell>
                  <ActionButton 
                    variant="edit" 
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </ActionButton>
                  <ActionButton 
                    variant="delete" 
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </ActionButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </ListContainer>
  );
};

export default ProductList;
