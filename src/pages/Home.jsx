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

const HomeHero = styled(Box)`
  ${({ theme }) => theme.mixins.flexColCenter}
  padding: ${({ theme }) => theme.layout.spacing.md};
  min-height: 100vh;
  width: 100vw;
`;

const Title = styled(Heading)`
  ${({ theme }) => theme.mixins.textH2}
`;

const SubTitle = styled(Text)`
  ${({ theme }) => theme.mixins.textP1}
`;

const HomeCallToAction = styled(Box)`
  ${({ theme }) => theme.mixins.flexColCenter}
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.layout.spacing.md};
  width: 100%;
  min-height: 40rem;
`;

const TestSection = styled(Box)`
  ${({ theme }) => theme.mixins.flexColCenter}
  background-color: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.layout.spacing.lg};
  width: 100%;
  min-height: 50rem;
  gap: 2rem;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Header />
      <HomeContent>
        <HomeHero>
          <Title>Unit 902</Title>
          <SubTitle>Marketplace</SubTitle>
        </HomeHero>
        <HomeCallToAction>
          <Text>Ready to get started?</Text>
          <Button variant="outline" colorScheme="whiteAlpha" size="lg">
            Get Started
          </Button>
        </HomeCallToAction>
        <TestSection>
          <Heading size="lg">Scroll Test Section</Heading>
          <Text textAlign="center" maxWidth="600px">
            This section provides additional content to test the header scroll behavior. 
            As you scroll down from the hero section, you should see the header background 
            transition from transparent to white, and the text color change from white to primary.
          </Text>
          <Text textAlign="center" maxWidth="600px">
            The navigation links and buttons should also update their hover states based on 
            whether the header is in its transparent or scrolled state.
          </Text>
          <Button colorScheme="blue" size="md">
            Test Button
          </Button>
        </TestSection>
      </HomeContent>
    </HomeContainer>
  );
};

export default Home;
