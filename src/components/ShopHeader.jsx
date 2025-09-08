import React from "react";
import styled from "@emotion/styled";
import UserProfileMenu from "./UserProfileMenu";
import MobileMenuButton from "./MobileMenuButton";
import ShopMobileNavigation from "./ShopMobileNavigation";

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`;

const ProfileMenuWrapper = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
  }
`;

const ShopMobileNavWrapper = styled.div`
  display: block;
  position: absolute;
  top: 1rem;
  right: 2rem;
  z-index: 10;

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

const MobileMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
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
  <>
    <Header>
      <ProfileMenuWrapper>
        <UserProfileMenu />
      </ProfileMenuWrapper>
      <Title>Marketplace</Title>
      <Subtitle>Discover amazing products at great prices</Subtitle>
      <ShopMobileNavWrapper>
        <MobileMenuWrapper>
          <MobileMenuButton />
        </MobileMenuWrapper>
      </ShopMobileNavWrapper>
    </Header>
    <ShopMobileNavigation />
  </>
);

export default ShopHeader;
