// src/pages/Home.jsx
import styled from "@emotion/styled";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

import Header from "../components/Header";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const HomeContent = styled(Box)`
  ${({ theme }) => theme.mixins.flexColCenter}
  width: 100%;
  height: 100%;
`;

const Hero = styled(Box)`
  ${({ theme }) => theme.mixins.flexColCenter}
  padding: ${({ theme }) => theme.layout.spacing.md};
  width: 20rem;
  height: 20rem;
  height: 100vh;
  width: 100vw;
`;

const Title = styled(Heading)`
  ${({ theme }) => theme.mixins.textH2}
`;

const SubTitle = styled(Text)`
  ${({ theme }) => theme.mixins.textP1}
`;

const CallToAction = styled(Box)`
  ${({ theme }) => theme.mixins.flexColCenter}
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.layout.spacing.md};
  width: 100%;
  height: 40rem;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Header />
      <HomeContent>
        <Hero>
          <Title>Unit 902</Title>
          <SubTitle>Marketplace</SubTitle>
        </Hero>
        <CallToAction>
          <Text>Ready to get started?</Text>
          <Button variant="outline" colorScheme="whiteAlpha" size="lg">
            Get Started
          </Button>
        </CallToAction>
      </HomeContent>
    </HomeContainer>
  );
};

export default Home;
