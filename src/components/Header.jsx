// src/components/Header.jsx
import { useState } from "react";
import styled from "@emotion/styled";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useScrollContext } from "../contexts/ScrollContext";
import { scrollToElement } from "../utils/smoothScroll";

const HeaderContainer = styled("header", {
  shouldForwardProp: prop => prop !== "isScrolled",
})`
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: ${({ isScrolled, theme }) =>
    isScrolled ? theme.colors.surface : "transparent"};
  width: 100%;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: ${({ isScrolled }) =>
    isScrolled ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none"};
`;

const HeaderWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 2rem;
  }
`;

const HeaderContent = styled("div", {
  shouldForwardProp: prop => prop !== "isScrolled",
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 8rem;
  color: ${({ isScrolled, theme }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  transition: color 0.3s ease;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 8rem;
  }
`;

const Logo = styled(Link, {
  shouldForwardProp: prop => prop !== "isScrolled",
})`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  font-weight: 700;
  font-size: 1.5rem;
  transition: color 0.3s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${({ isScrolled, theme }) =>
        isScrolled ? theme.colors.primary : theme.colors.whiteShadowDark};
    }
  }

  &:active {
    color: ${({ isScrolled, theme }) =>
      isScrolled ? theme.colors.primary : theme.colors.whiteShadowDark};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const LogoText = styled("h5", {
  shouldForwardProp: prop => prop !== "isScrolled",
})`
  ${({ theme }) => theme.mixins.textH5}
  color: ${({ isScrolled, theme }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  transition: color 0.3s ease;
`;

// Mobile menu button
const MobileMenuButton = styled("button", {
  shouldForwardProp: prop => prop !== "isScrolled",
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  color: ${({ isScrolled, theme }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.layout.borderRadius.md};
  transition: all 0.2s ease;

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

// Desktop navigation
const DesktopNavigation = styled.nav`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
`;

// Mobile navigation overlay
const MobileNavigation = styled("nav", {
  shouldForwardProp: prop => prop !== "isOpen",
})`
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 6px ${({ theme }) => theme.colors.shadow};
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-100%)"};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
  padding: 1rem;

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
  gap: 0.5rem;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    gap: 2rem;
  }
`;

const NavigationItem = styled.li`
  margin: 0;
`;

const NavigationLink = styled('div', {
  shouldForwardProp: prop => prop !== "isScrolled" && prop !== "as",
})`
  ${({ theme }) => theme.mixins.textP4}
  display: block;
  padding: 0.75rem 1rem;
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

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0.5rem 1rem;
  }
`;

// Authentication buttons
const AuthButton = styled("button", {
  shouldForwardProp: prop => prop !== "isScrolled",
})`
  ${({ theme }) => theme.mixins.textP4}
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
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

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0.5rem 1rem;
  }
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

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useScrollContext();
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
      navigate("/");
    }
    closeMobileMenu();
  };

  // Handle login navigation
  const handleLogin = () => {
    navigate("/login");
    closeMobileMenu();
  };

  // Handle profile navigation
  const handleProfile = () => {
    navigate("/profile");
    closeMobileMenu();
  };

  // Handle navigation clicks (including hash navigation)
  const handleNavigation = (href) => {
    if (href.startsWith('#')) {
      // Hash navigation - only scroll if we're on the home page
      if (location.pathname === '/') {
        const elementId = href.substring(1);
        scrollToElement(elementId, 100); // 100px offset for header
      } else {
        // Navigate to home page with hash
        navigate(`/${href}`);
      }
    } else {
      // Regular navigation
      navigate(href);
    }
    closeMobileMenu();
  };

  // Navigation items (excluding auth items)
  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <HeaderContainer isScrolled={isScrolled} role="banner">
        <HeaderWrapper>
          <HeaderContent isScrolled={isScrolled}>
            {/* Logo */}
            <Logo
              to="/"
              isScrolled={isScrolled}
              aria-label="Unit 902 - Go to homepage"
            >
              <LogoText isScrolled={isScrolled}>Unit 902</LogoText>
            </Logo>

            {/* Desktop Navigation */}
            <DesktopNavigation role="navigation" aria-label="Main navigation">
              <NavigationList>
                {navigationItems.map(item => (
                  <NavigationItem key={item.href}>
                    <NavigationLink
                      as={item.href.startsWith('#') ? 'button' : Link}
                      to={item.href.startsWith('#') ? undefined : item.href}
                      onClick={() => handleNavigation(item.href)}
                      isScrolled={isScrolled}
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
                      <AuthButton
                        isScrolled={isScrolled}
                        onClick={handleProfile}
                      >
                        <User size={16} />
                        Profile
                      </AuthButton>
                    </NavigationItem>
                    <NavigationItem>
                      <AuthButton
                        isScrolled={isScrolled}
                        onClick={handleLogout}
                      >
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
            </DesktopNavigation>

            {/* Mobile Menu Button */}
            <MobileMenuButton
              isScrolled={isScrolled}
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
                  as={item.href.startsWith('#') ? 'button' : Link}
                  to={item.href.startsWith('#') ? undefined : item.href}
                  onClick={() => handleNavigation(item.href)}
                  isScrolled={isScrolled}
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
        </MobileNavigation>
      </HeaderContainer>
    </>
  );
};

export default Header;
