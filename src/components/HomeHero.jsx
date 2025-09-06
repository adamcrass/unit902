// src/components/HomeHero.jsx
import styled from "@emotion/styled";

const HomeHeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h1`
  ${({ theme }) => theme.mixins.textH2}
`;

const SubTitle = styled.p`
  ${({ theme }) => theme.mixins.textP1}
`;

const HomeHero = () => {
  return (
    <HomeHeroContainer>
      <Title>Unit 902</Title>
      <SubTitle>Marketplace</SubTitle>
    </HomeHeroContainer>
  );
};

export default HomeHero;
