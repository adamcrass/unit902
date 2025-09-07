// src/pages/Shop.jsx
import styled from "@emotion/styled";
import { ShopProvider, useShop } from "../contexts/ShopContext";
import ShopHeader from "../components/ShopHeader";

// Styled Components
const ShopContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

import CategoryBar from "../components/ShopCategoryBar";

const SearchInput = styled.input`
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 25px;
  width: 300px;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

import ShopProductCard from "../components/ShopProductCard";

const NoResults = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin-top: 3rem;
`;

import { renderStars } from "../utils/shopUtils.jsx";

const Shop = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    filteredProducts,
  } = useShop();

  const handleAddToCart = product => {
    // Add your cart logic here
    console.log("Added to cart:", product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <ShopContainer>
      <ShopHeader />

      <FilterSection>
        <CategoryBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <SearchInput
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </FilterSection>

      {filteredProducts.length > 0 ? (
        <ProductGrid>
          {filteredProducts.map(product => (
            <ShopProductCard
              key={product.id}
              product={product}
              renderStars={renderStars}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </ProductGrid>
      ) : (
        <NoResults>No products found matching your criteria.</NoResults>
      )}
    </ShopContainer>
  );
};

export default Shop;
