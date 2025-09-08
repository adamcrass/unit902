// src/components/MobileNavigation.jsx
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { headerNavigationItems } from "../config/navigation";
import { useNavigation } from "../contexts/NavigationContext";
import { useScrollContext } from "../contexts/ScrollContext";

// Mobile navigation overlay
const MobileNavigationContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 2rem;

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

const NavigationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.5rem;
  text-align: right;
`;

const NavigationItem = styled.li`
  margin: 0;
`;

const NavigationLink = styled("div", {
  shouldForwardProp: prop => prop !== "isScrolled" && prop !== "as",
})`
  ${({ theme }) => theme.mixins.textH4}
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  text-align: right;
  font-weight: 400;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateX(-10px);
    }
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(-5px);
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

// Authentication buttons
const AuthButton = styled.button`
  ${({ theme }) => theme.mixins.textH4}
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.white};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;
  font-weight: 400;
  text-align: right;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.shadow};
      transform: translateX(-10px);
    }
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.shadow};
    transform: translateX(-5px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 2px;
  }
`;

const MobileNavigation = () => {
  const { isScrolled } = useScrollContext();
  const {
    user,
    isActive,
    handleNavigation,
    handleLogin,
    isMobileMenuOpen,
    handleOverlayClick,
  } = useNavigation();
  return (
    <MobileNavigationContainer
      id="mobile-navigation"
      isOpen={isMobileMenuOpen}
      role="navigation"
      aria-label="Mobile navigation"
      onClick={handleOverlayClick}
    >
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

        {/* Mobile Authentication Items */}
        {!user && (
          <NavigationItem>
            <AuthButton isScrolled={isScrolled} onClick={handleLogin}>
              Login
            </AuthButton>
          </NavigationItem>
        )}
      </NavigationList>
    </MobileNavigationContainer>
  );
};

export default MobileNavigation;
