// src/components/MobileMenuButton.jsx
import styled from "@emotion/styled";
import { useScrollContext } from "../contexts/ScrollContext";
import { useNavigation } from "../contexts/NavigationContext";

// Mobile menu button
const MobileMenuButtonContainer = styled.button`
  ${({ theme }) => theme.mixins.flexRowCenter}
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1000;
  padding: 0.5rem;

  &:active {
    transform: scale(0.95);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

// Animated hamburger lines
const HamburgerLine = styled.span`
  display: block;
  width: 20px;
  height: 2px;
  background-color: ${({ isScrolled, theme }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: absolute;

  &:nth-of-type(1) {
    top: ${({ isOpen }) => (isOpen ? "50%" : "calc(50% - 6px)")};
    transform: ${({ isOpen }) =>
      isOpen ? "translateY(-50%) rotate(45deg)" : "translateY(-50%) rotate(0)"};
  }

  &:nth-of-type(2) {
    top: 50%;
    transform: translateY(-50%);
    opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
    width: ${({ isOpen }) => (isOpen ? "0" : "20px")};
  }

  &:nth-of-type(3) {
    top: ${({ isOpen }) => (isOpen ? "50%" : "calc(50% + 6px)")};
    transform: ${({ isOpen }) =>
      isOpen
        ? "translateY(-50%) rotate(-45deg)"
        : "translateY(-50%) rotate(0)"};
  }
`;

const MobileMenuButton = () => {
  const { isScrolled } = useScrollContext();
  const { isMobileMenuOpen, toggleMobileMenu } = useNavigation();

  return (
    <MobileMenuButtonContainer
      isScrolled={isScrolled}
      onClick={toggleMobileMenu}
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-navigation"
      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
    >
      <HamburgerLine isOpen={isMobileMenuOpen} isScrolled={isScrolled} />
      <HamburgerLine isOpen={isMobileMenuOpen} isScrolled={isScrolled} />
      <HamburgerLine isOpen={isMobileMenuOpen} isScrolled={isScrolled} />
    </MobileMenuButtonContainer>
  );
};

export default MobileMenuButton;
