import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../config/firebase";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const db = getDatabase(app);
    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array
        setProducts(Object.values(data));
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <ShopContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        searchTerm,
        setSearchTerm,
        filteredProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
