// src/services/productService.js
import {
  ref,
  push,
  get,
  set,
  remove,
  onValue,
  serverTimestamp,
} from "firebase/database";
import { db } from "../config/firebase";

const PRODUCTS_PATH = "products";

export const productService = {
  // Add a new product
  async addProduct(productData) {
    try {
      const productsRef = ref(db, PRODUCTS_PATH);
      const newProductRef = push(productsRef, {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: newProductRef.key,
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error("Failed to add product: " + error.message);
    }
  },

  // Get all products (one-time fetch)
  async getProducts() {
    try {
      console.log("Fetching products from Realtime Database...");

      const productsRef = ref(db, PRODUCTS_PATH);
      const snapshot = await get(productsRef);
      const products = [];

      console.log("Snapshot exists:", snapshot.exists());

      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Raw data:", data);

        Object.entries(data).forEach(([id, productData]) => {
          console.log("Product data:", { id, ...productData });

          // Normalize the product data to handle different formats
          const normalizedProduct = {
            id,
            name: productData.name || "",
            description: productData.description || "",
            // Handle price - existing products use dollars, new ones use cents
            price:
              typeof productData.price === "number" && productData.price < 1000
                ? Math.round(productData.price * 100) // Convert dollars to cents
                : productData.price || 0,
            category: productData.category || "",
            subcategory: productData.subcategory || "",
            image: productData.image || "",
            attributes: productData.attributes || "",
            inStock:
              productData.inStock !== undefined ? productData.inStock : true,
            quantity: productData.quantity || 0,
            // Convert timestamps to Date objects if they exist
            createdAt: productData.createdAt
              ? new Date(productData.createdAt)
              : new Date(),
            updatedAt: productData.updatedAt
              ? new Date(productData.updatedAt)
              : new Date(),
            createdBy: productData.createdBy || "Unknown",
            updatedBy: productData.updatedBy || "Unknown",
          };

          products.push(normalizedProduct);
        });

        // Sort by creation date
        products.sort((a, b) => b.createdAt - a.createdAt);
      }

      console.log("Final products array:", products);
      return products;
    } catch (error) {
      console.error("Error getting products:", error);
      throw new Error("Failed to fetch products: " + error.message);
    }
  },

  // Listen to real-time product updates
  listenToProducts(callback) {
    const productsRef = ref(db, PRODUCTS_PATH);

    const unsubscribe = onValue(
      productsRef,
      snapshot => {
        const products = [];

        if (snapshot.exists()) {
          const data = snapshot.val();

          Object.entries(data).forEach(([id, productData]) => {
            // Normalize the product data to handle different formats
            const normalizedProduct = {
              id,
              name: productData.name || "",
              description: productData.description || "",
              // Handle price - existing products use dollars, new ones use cents
              price:
                typeof productData.price === "number" &&
                productData.price < 1000
                  ? Math.round(productData.price * 100) // Convert dollars to cents
                  : productData.price || 0,
              category: productData.category || "",
              subcategory: productData.subcategory || "",
              image: productData.image || "",
              attributes: productData.attributes || "",
              inStock:
                productData.inStock !== undefined ? productData.inStock : true,
              quantity: productData.quantity || 0,
              // Convert timestamps to Date objects if they exist
              createdAt: productData.createdAt
                ? new Date(productData.createdAt)
                : new Date(),
              updatedAt: productData.updatedAt
                ? new Date(productData.updatedAt)
                : new Date(),
              createdBy: productData.createdBy || "Unknown",
              updatedBy: productData.updatedBy || "Unknown",
            };

            products.push(normalizedProduct);
          });

          // Sort by creation date
          products.sort((a, b) => b.createdAt - a.createdAt);
        }

        callback(products);
      },
      error => {
        console.error("Error listening to products:", error);
        callback(null, error);
      }
    );

    return unsubscribe;
  },

  // Update a product
  async updateProduct(productId, updates) {
    try {
      const productRef = ref(db, `${PRODUCTS_PATH}/${productId}`);
      await set(productRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      return {
        id: productId,
        ...updates,
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product: " + error.message);
    }
  },

  // Delete a product
  async deleteProduct(productId) {
    try {
      const productRef = ref(db, `${PRODUCTS_PATH}/${productId}`);
      await remove(productRef);
      return productId;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product: " + error.message);
    }
  },
};
