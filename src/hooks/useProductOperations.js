// src/hooks/useProductOperations.js
import { useState } from "react";
import { productService } from "../services/productService";

export const useProductOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const newProduct = await productService.addProduct(productData);
      return newProduct;
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await productService.updateProduct(productId, updates);
      return updatedProduct;
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      await productService.deleteProduct(productId);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // State
    loading,
    error,
    
    // Operations
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Utilities
    clearError
  };
};
