// src/components/ShopCategoryBar.jsx
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../config/firebase";

const CategoryFilters = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

export default function ShopCategoryBar({ selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState(["All"]);
  useEffect(() => {
    const db = getDatabase(app);
    const categoriesRef = ref(db, 'categories');
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Array.isArray(data)) {
        setCategories(data);
      } else if (data && typeof data === 'object') {
        setCategories(Object.values(data));
      } else {
        setCategories(["All"]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <CategoryFilters>
      {categories.map((cat) => (
        <FilterButton
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          style={{
            background: selectedCategory === cat ? "#fff" : "transparent",
            color: selectedCategory === cat ? "#222" : "#fff",
          }}
        >
          {cat}
        </FilterButton>
      ))}
    </CategoryFilters>
  );
}
