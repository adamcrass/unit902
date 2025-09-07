// src/components/ShopCategoryBar.jsx
import styled from "@emotion/styled";
import categories from "../data/mockCategories";

const CategoryFilters = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: ${props =>
    props.active ? "rgba(255, 255, 255, 0.2)" : "transparent"};
  color: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const ShopCategoryBar = ({ selectedCategory, setSelectedCategory }) => (
  <CategoryFilters>
    {categories.map(category => (
      <FilterButton
        key={category}
        active={selectedCategory === category}
        onClick={() => setSelectedCategory(category)}
      >
        {category}
      </FilterButton>
    ))}
  </CategoryFilters>
);

export default ShopCategoryBar;
