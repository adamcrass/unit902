// src/components/HomeHeader.jsx
import React from "react";
import styled from "@emotion/styled";
import { useScrollContext } from "../contexts/ScrollContext";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import MobileMenuButton from "./MobileMenuButton";
import UserProfileMenu from "./UserProfileMenu";

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.header};
  background-color: ${({ isScrolled, theme }) =>
    isScrolled ? theme.colors.surface : "transparent"};
  width: 100%;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: ${({ isScrolled, theme }) =>
    isScrolled ? `0 2px 8px ${theme.colors.shadow}` : "none"};
`;

const HeaderWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 2rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 8rem;
  color: ${({ isScrolled, theme }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  transition: color 0.3s ease;
  position: relative;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 8rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.h5`
  ${({ theme }) => theme.mixins.textH5}
  color: ${({ isScrolled, theme }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  transition: color 0.3s ease;
`;

// Skip to main content for accessibility
const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 8px;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.layout.borderRadius.xl};
  z-index: 1001;

  &:focus {
    top: 6px;
  }
`;

const HomeHeader = () => {
  const { isScrolled } = useScrollContext();

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <HeaderContainer isScrolled={isScrolled} role="banner">
        <HeaderWrapper>
          <HeaderContent isScrolled={isScrolled}>
            {/* Logo */}
            <Logo aria-label="Unit 902">
              <LogoText isScrolled={isScrolled}>Unit 902</LogoText>
            </Logo>
            {/* Desktop Navigation */}
            <DesktopNavigation />
            {/* Right Section with Profile Menu and Mobile Button */}
            <RightSection>
              <UserProfileMenu isScrolled={isScrolled} />
              <MobileMenuButton />
            </RightSection>
          </HeaderContent>
        </HeaderWrapper>
        {/* Mobile Navigation */}
        <MobileNavigation />
      </HeaderContainer>
    </>
  );
};

export default HomeHeader;
