// src/pages/Home.jsx
import styled from "@emotion/styled";
import { Box, Heading, Text } from "@chakra-ui/react";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.layout.spacing.lg};
`;

const HomeContent = styled(Box)`
  ${({ theme }) => theme.mixins.flexColCenter}
  border: 1px solid ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.layout.spacing.md};
  height: 20rem;
  width: 20rem;
`;

const Title = styled(Heading)`
  ${({ theme }) => theme.mixins.textH2}
`;

const SubTitle = styled(Text)`
  ${({ theme }) => theme.mixins.textP1}
`;

const Home = () => {
  return (
    <HomeContainer>
      <HomeContent>
        <Title>Unit 902</Title>
        <SubTitle>Marketplace</SubTitle>
      </HomeContent>
    </HomeContainer>
  );
};

export default Home;
