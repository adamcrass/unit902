// src/pages/Shop.jsx
import styled from "@emotion/styled";

const ShopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h1`
  ${({ theme }) => theme.mixins.textH1}
  color: ${({ theme }) => theme.colors.white};
`;

const Shop = () => {
  return (
    <ShopContainer>
      <Title>Shop</Title>
    </ShopContainer>
  );
};

export default Shop;
