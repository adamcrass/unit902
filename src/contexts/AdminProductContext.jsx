// src/contexts/AdminProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { productService } from "../services/productService";
import { useProductOperations } from "../hooks/useProductOperations";

const AdminProductContext = createContext();

export const useAdminProduct = () => {
  const context = useContext(AdminProductContext);
  if (!context) {
    throw new Error("useAdminProduct must be used within AdminProductProvider");
  }
  return context;
};

export const AdminProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  
  // Use the product operations hook
  const productOperations = useProductOperations();

  // Set up real-time listener on mount
  useEffect(() => {
    const unsubscribe = productService.listenToProducts((products, error) => {
      if (error) {
        console.error("Error listening to products:", error);
        setDataError("Failed to load products");
        setDataLoading(false);
        return;
      }
      
      setProducts(products);
      setDataLoading(false);
      setDataError(null);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadProducts = async () => {
    try {
      setDataLoading(true);
      setDataError(null);
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error loading products:", err);
      setDataError("Failed to load products");
    } finally {
      setDataLoading(false);
    }
  };

  // Calculate stats from products
  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.quantity > 0).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  };

  const value = {
    // State
    products,
    loading: dataLoading || productOperations.loading,
    error: dataError || productOperations.error,
    stats,
    
    // Actions
    loadProducts,
    addProduct: productOperations.addProduct,
    updateProduct: productOperations.updateProduct,
    deleteProduct: productOperations.deleteProduct,
    clearError: productOperations.clearError
  };

  return (
    <AdminProductContext.Provider value={value}>
      {children}
    </AdminProductContext.Provider>
  );
};
