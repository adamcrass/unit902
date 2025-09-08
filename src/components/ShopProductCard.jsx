import styled from "@emotion/styled";

const ProductCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ProductCategory = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2e7d32;
  margin-bottom: 1rem;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  color: #ffc107;
`;

const ReviewCount = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px ${({ theme }) => theme.colors.primaryFocus};
  }
`;

const ShopProductCard = ({ product, renderStars, handleAddToCart }) => (
  <ProductCard>
    <ProductImage src={product.image} alt={product.name} />
    <ProductCategory>{product.category}</ProductCategory>
    <ProductName>{product.name}</ProductName>
    <ProductPrice>${product.price}</ProductPrice>
    <ProductRating>
      <Stars>{renderStars(product.rating)}</Stars>
      <ReviewCount>({product.reviews} reviews)</ReviewCount>
    </ProductRating>
    <AddToCartButton onClick={() => handleAddToCart(product)}>
      Add to Cart
    </AddToCartButton>
  </ProductCard>
);

export default ShopProductCard;
