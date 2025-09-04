// src/pages/Home.jsx
import styled from "@emotion/styled";
import { Heading, Text } from "@chakra-ui/react";

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

const Title = styled(Heading)`
  ${({ theme }) => theme.mixins.textH2}
`;

const SubTitle = styled(Text)`
  ${({ theme }) => theme.mixins.textP1}
`;

const Home = () => {
  return (
    <HomeContainer>
      <Title>Unit 902</Title>
      <SubTitle>Marketplace</SubTitle>
    </HomeContainer>
  );
};

export default Home;
