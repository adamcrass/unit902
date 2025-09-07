import styled from "@emotion/styled";

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const ShopHeader = () => (
  <Header>
    <Title>Marketplace</Title>
    <Subtitle>Discover amazing products at great prices</Subtitle>
  </Header>
);

export default ShopHeader;
