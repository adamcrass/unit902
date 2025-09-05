// src/components/Header.jsx
import { useState } from "react";
import styled from "@emotion/styled";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: transparent;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;

  color: ${({ theme }) => theme.colors.white};

  @media (min-width: 768px) {
    height: 5rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const LogoText = styled.h5`
  ${({ theme }) => theme.mixins.textH5}
  color: ${({ theme }) => theme.colors.white};
`;

// Mobile menu button
const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

// Desktop navigation
const DesktopNavigation = styled.nav`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
`;

// Mobile navigation overlay
const MobileNavigation = styled.nav`
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-100%)"};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
  padding: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const NavigationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const NavigationItem = styled.li`
  margin: 0;
`;

const NavigationLink = styled(Link)`
  ${({ theme }) => theme.mixins.textP4}
  display: block;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &[aria-current="page"] {
    background-color: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }

  @media (min-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

// Authentication buttons
const AuthButton = styled.button`
  ${({ theme }) => theme.mixins.textP4}
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.white};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (min-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

// Skip to main content for accessibility
const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1001;

  &:focus {
    top: 6px;
  }
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = pathname => location.pathname === pathname;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      closeMobileMenu();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate('/');
    }
    closeMobileMenu();
  };

  // Handle login navigation
  const handleLogin = () => {
    navigate('/login');
    closeMobileMenu();
  };

  // Handle profile navigation
  const handleProfile = () => {
    navigate('/profile');
    closeMobileMenu();
  };

  // Navigation items (excluding auth items)
  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <HeaderContainer role="banner">
        <HeaderWrapper>
          <HeaderContent>
            {/* Logo */}
            <Logo to="/" aria-label="Unit 902 - Go to homepage">
              <LogoText>Unit 902</LogoText>
            </Logo>

            {/* Desktop Navigation */}
            <DesktopNavigation role="navigation" aria-label="Main navigation">
              <NavigationList>
                {navigationItems.map(item => (
                  <NavigationItem key={item.href}>
                    <NavigationLink
                      to={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </NavigationLink>
                  </NavigationItem>
                ))}
                
                {/* Authentication Items */}
                {user ? (
                  <>
                    <NavigationItem>
                      <AuthButton onClick={handleProfile}>
                        <User size={16} />
                        Profile
                      </AuthButton>
                    </NavigationItem>
                    <NavigationItem>
                      <AuthButton onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </AuthButton>
                    </NavigationItem>
                  </>
                ) : (
                  <NavigationItem>
                    <AuthButton onClick={handleLogin}>
                      Login
                    </AuthButton>
                  </NavigationItem>
                )}
              </NavigationList>
            </DesktopNavigation>

            {/* Mobile Menu Button */}
            <MobileMenuButton
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </MobileMenuButton>
          </HeaderContent>
        </HeaderWrapper>

        {/* Mobile Navigation */}
        <MobileNavigation
          id="mobile-navigation"
          isOpen={isMobileMenuOpen}
          role="navigation"
          aria-label="Mobile navigation"
          onClick={handleOverlayClick}
        >
          <NavigationList>
            {navigationItems.map(item => (
              <NavigationItem key={item.href}>
                <NavigationLink
                  to={item.href}
                  onClick={closeMobileMenu}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </NavigationLink>
              </NavigationItem>
            ))}
            
            {/* Mobile Authentication Items */}
            {user ? (
              <>
                <NavigationItem>
                  <AuthButton onClick={handleProfile}>
                    <User size={16} />
                    Profile
                  </AuthButton>
                </NavigationItem>
                <NavigationItem>
                  <AuthButton onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </AuthButton>
                </NavigationItem>
              </>
            ) : (
              <NavigationItem>
                <AuthButton onClick={handleLogin}>
                  Login
                </AuthButton>
              </NavigationItem>
            )}
          </NavigationList>
        </MobileNavigation>
      </HeaderContainer>
    </>
  );
};

export default Header;
