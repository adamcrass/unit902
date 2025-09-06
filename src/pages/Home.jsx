// src/pages/Home.jsx
import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

import Header from "../components/Header";
import HomeHero from "../components/HomeHero";
import HomeAbout from "../components/HomeAbout";
import HomeContact from "../components/HomeContact";
import HomeCTA from "../components/HomeCTA";
import HomeFooter from "../components/HomeFooter";
import { setupHashNavigation } from "../utils/smoothScroll";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const HomeContent = styled(Box)`
  ${({ theme }) => theme.mixins.flexColCenter}
  width: 100%;
`;

const Home = () => {
  useEffect(() => {
    // Set up hash navigation for smooth scrolling to sections
    const cleanup = setupHashNavigation(120);

    return cleanup; // Cleanup listeners on unmount
  }, []);

  return (
    <HomeContainer>
      <Header />
      <HomeContent>
        <HomeHero />
        <HomeCTA />
        <HomeAbout />
        <HomeContact />
      </HomeContent>
      <HomeFooter />
    </HomeContainer>
  );
};

export default Home;
