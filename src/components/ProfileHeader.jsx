// src/components/ProfileHeader.jsx
import React from "react";
import styled from "@emotion/styled";
import { User } from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import MobileMenuButton from "./MobileMenuButton";
import ProfileMobileNavigation from "./ProfileMobileNavigation";
import ProfileDesktopNavigation from "./ProfileDesktopNavigation";

const HeaderContainer = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 2rem 1rem;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 3rem 2rem;
  }
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
  flex-direction: column;
  gap: 1.5rem;
`;

const NavigationSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.h5`
  ${({ theme }) => theme.mixins.textH5}
  color: ${({ theme }) => theme.colors.white};
  margin: 0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    text-align: left;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 1.8rem;

  &:hover {
    color: ${({ theme }) => theme.colors.whiteOverlayStrong};
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.whiteOverlayMedium};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 100px;
    height: 100px;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 0.5rem 0;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 32px;
  }
`;

const UserEmail = styled.p`
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
`;

const ProfileHeader = () => {
  const { user } = useAuth();

  // Get display name
  const getDisplayName = user => {
    return user?.displayName || user?.email?.split("@")[0] || "User";
  };

  return (
    <>
      <HeaderContainer>
        <HeaderWrapper>
          <HeaderContent>
            <NavigationSection>
              {/* Logo */}
              <Logo aria-label="Unit 902">
                <LogoText>Unit 902</LogoText>
              </Logo>

              {/* Desktop Navigation */}
              <ProfileDesktopNavigation />

              {/* Mobile Menu Button */}
              <MobileMenuButton />
            </NavigationSection>

            <ProfileInfo>
              <Avatar>
                {user?.photoURL ? (
                  <ProfileImage src={user.photoURL} alt="Profile" />
                ) : (
                  <User size={40} />
                )}
              </Avatar>
              <UserDetails>
                <UserName>{getDisplayName(user)}</UserName>
                <UserEmail>{user?.email}</UserEmail>
              </UserDetails>
            </ProfileInfo>
          </HeaderContent>
        </HeaderWrapper>

        {/* Mobile Navigation */}
        <ProfileMobileNavigation />
      </HeaderContainer>
    </>
  );
};

export default ProfileHeader;
