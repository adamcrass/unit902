// src/contexts/AdminProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { productService } from "../services/productService";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up real-time listener on mount
  useEffect(() => {
    const unsubscribe = productService.listenToProducts((products, error) => {
      if (error) {
        console.error("Error listening to products:", error);
        setError("Failed to load products");
        setLoading(false);
        return;
      }
      
      setProducts(products);
      setLoading(false);
      setError(null);
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
      setLoading(true);
      setError(null);
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      setError(null);
      const newProduct = await productService.addProduct(productData);
      // Don't update local state - real-time listener will handle it
      return newProduct;
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product");
      throw err;
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      setError(null);
      const updatedProduct = await productService.updateProduct(productId, updates);
      // Don't update local state - real-time listener will handle it
      return updatedProduct;
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setError(null);
      await productService.deleteProduct(productId);
      // Don't update local state - real-time listener will handle it
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      throw err;
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
    loading,
    error,
    stats,
    
    // Actions
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <AdminProductContext.Provider value={value}>
      {children}
    </AdminProductContext.Provider>
  );
};
