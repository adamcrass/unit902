// src/components/ProfileHeader.jsx
import React from "react";
import styled from "@emotion/styled";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { profileNavigationItems } from "../config/navigation";
import { Link } from "react-router-dom";
import Button from "./Button";

const HeaderContainer = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 2rem 1rem;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 3rem 2rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const NavigationBar = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: flex-end;
  align-items: center;
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

const StyledLogoutButton = styled(Button)`
  width: auto;
  padding: 0.5rem 1rem;
  font-size: 1.8rem;
  min-height: auto;
  border: none;

  &:hover {
    background: ${({ theme }) => theme.colors.whiteOverlayLight};
    transform: none;
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get display name
  const getDisplayName = user => {
    return user?.displayName || user?.email?.split("@")[0] || "User";
  };

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate("/");
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <NavigationBar>
          {profileNavigationItems.map(item => (
            <NavLink key={item.href} to={item.href}>
              {item.label}
            </NavLink>
          ))}
          <div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={20} />
              Sign Out
            </Button>
          </div>
        </NavigationBar>

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
    </HeaderContainer>
  );
};

export default ProfileHeader;
