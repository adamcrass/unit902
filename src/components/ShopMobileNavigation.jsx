// src/components/ShopMobileNavigation.jsx
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { shopNavigationItems } from "../config/navigation";
import { useNavigation } from "../contexts/NavigationContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  z-index: ${({ theme }) => theme.zIndices.navbar};
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

const NavigationLink = styled(Link)`
  ${({ theme }) => theme.mixins.textH4}
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;
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

// Logout button
const LogoutButton = styled.button`
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

const ShopMobileNavigation = () => {
  const { isActive, handleNavigation, isMobileMenuOpen, handleOverlayClick } =
    useNavigation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate("/");
    }
  };

  return (
    <MobileNavigationContainer
      id="shop-mobile-navigation"
      isOpen={isMobileMenuOpen}
      role="navigation"
      aria-label="Shop mobile navigation"
      onClick={handleOverlayClick}
    >
      <NavigationList>
        {shopNavigationItems.map(item => (
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

        {/* Mobile Logout Button - only show if user is logged in */}
        {user && (
          <NavigationItem>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={20} />
              Sign Out
            </LogoutButton>
          </NavigationItem>
        )}
      </NavigationList>
    </MobileNavigationContainer>
  );
};

export default ShopMobileNavigation;
