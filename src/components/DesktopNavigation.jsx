// src/components/DesktopNavigation.jsx
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { headerNavigationItems } from "../config/navigation";
import { useNavigation } from "../contexts/NavigationContext";
import { useScrollContext } from "../contexts/ScrollContext";

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

const NavigationLink = styled("div", {
  shouldForwardProp: prop => prop !== "isScrolled" && prop !== "as",
})`
  ${({ theme }) => theme.mixins.textP4}
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: inherit;
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ isScrolled, theme }) =>
        isScrolled ? theme.colors.surfaceHover : "rgba(255, 255, 255, 0.1)"};
      color: ${({ isScrolled, theme }) =>
        isScrolled ? theme.colors.primary : theme.colors.white};
    }
  }

  &:active {
    background-color: ${({ isScrolled, theme }) =>
      isScrolled ? theme.colors.surfaceHover : theme.colors.whiteShadowLight};
    color: ${({ isScrolled, theme }) =>
      isScrolled ? theme.colors.primary : theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &[aria-current="page"] {
    background-color: ${({ isScrolled, theme }) =>
      isScrolled ? theme.colors.primarySoft : theme.colors.whiteShadowLight};
    color: ${({ isScrolled, theme }) =>
      isScrolled ? theme.colors.primary : theme.colors.white};
    font-weight: 600;
  }
`;

// Authentication buttons
const AuthButton = styled.button`
  ${({ theme }) => theme.mixins.textP4}
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: ${({ isScrolled, theme }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ isScrolled, theme }) =>
        isScrolled ? theme.colors.surfaceHover : theme.colors.whiteShadowLight};
      color: ${({ isScrolled, theme }) =>
        isScrolled ? theme.colors.primary : theme.colors.white};
    }
  }

  &:active {
    background-color: ${({ isScrolled, theme }) =>
      isScrolled ? theme.colors.surfaceHover : theme.colors.whiteShadowLight};
    color: ${({ isScrolled, theme }) =>
      isScrolled ? theme.colors.primary : theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const DesktopNavigation = () => {
  const { isScrolled } = useScrollContext();
  const {
    user,
    isActive,
    handleNavigation,
    handleProfile,
    handleLogout,
    handleLogin,
  } = useNavigation();
  return (
    <DesktopNavigationContainer role="navigation" aria-label="Main navigation">
      <NavigationList>
        {headerNavigationItems.map(item => (
          <NavigationItem key={item.href}>
            <NavigationLink
              as={item.href.startsWith("#") ? "button" : Link}
              to={item.href.startsWith("#") ? undefined : item.href}
              onClick={() => handleNavigation(item.href)}
              isScrolled={isScrolled}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </NavigationLink>
          </NavigationItem>
        ))}

        {/* Authentication Items */}
        {/* TODO: move to profile menu */}
        {user ? (
          <>
            <NavigationItem>
              <AuthButton isScrolled={isScrolled} onClick={handleProfile}>
                <User size={16} />
                Profile
              </AuthButton>
            </NavigationItem>
            <NavigationItem>
              <AuthButton isScrolled={isScrolled} onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </AuthButton>
            </NavigationItem>
          </>
        ) : (
          <NavigationItem>
            <AuthButton isScrolled={isScrolled} onClick={handleLogin}>
              Login
            </AuthButton>
          </NavigationItem>
        )}
      </NavigationList>
    </DesktopNavigationContainer>
  );
};

export default DesktopNavigation;
