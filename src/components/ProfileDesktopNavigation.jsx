// src/components/ProfileDesktopNavigation.jsx
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { profileNavigationItems } from "../config/navigation";
import { useNavigation } from "../contexts/NavigationContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Desktop navigation
const DesktopNavigationContainer = styled.nav`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
`;

const NavigationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 2rem;
`;

const NavigationItem = styled.li`
  margin: 0;
`;

const NavigationLink = styled(Link)`
  ${({ theme }) => theme.mixins.textP4}
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: ${({ theme }) => theme.colors.white};
    }
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
    color: ${({ theme }) => theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 2px;
  }

  &[aria-current="page"] {
    background-color: rgba(255, 255, 255, 0.15);
    color: ${({ theme }) => theme.colors.white};
    font-weight: 600;
  }
`;

// Logout button
const LogoutButton = styled.button`
  ${({ theme }) => theme.mixins.textP4}
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.white};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: ${({ theme }) => theme.colors.white};
    }
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
    color: ${({ theme }) => theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 2px;
  }
`;

const ProfileDesktopNavigation = () => {
  const { isActive, handleNavigation } = useNavigation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate("/");
    }
  };

  return (
    <DesktopNavigationContainer role="navigation" aria-label="Profile navigation">
      <NavigationList>
        {profileNavigationItems.map(item => (
          <NavigationItem key={item.href}>
            <NavigationLink
              to={item.href}
              onClick={() => handleNavigation(item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </NavigationLink>
          </NavigationItem>
        ))}

        {/* Logout Button */}
        <NavigationItem>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </LogoutButton>
        </NavigationItem>
      </NavigationList>
    </DesktopNavigationContainer>
  );
};

export default ProfileDesktopNavigation;
