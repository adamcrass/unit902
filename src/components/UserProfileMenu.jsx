// src/components/UserProfileMenu.jsx
import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { User, Settings, LogOut, Shield, ChevronDown } from "lucide-react";
import useProfileMenu from "../hooks/useProfileMenu";
import useUserDisplay from "../hooks/useUserDisplay";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProfileMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const MenuTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.5rem 0.5rem;
  border-radius: 2rem;
  border: none;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 2.5rem;
  position: relative;

  /* Ensure minimum touch target of 44px */
  @media (max-width: 640px) {
    min-height: 44px;
    min-width: 44px;
    padding: 0.5rem;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.surface : theme.colors.whiteOverlayMedium};
    border: 1px solid
      ${({ theme, isScrolled }) =>
        isScrolled ? theme.colors.border : theme.colors.whiteOverlayMedium};
    &:hover {
      background: ${({ theme, isScrolled }) =>
        isScrolled
          ? theme.colors.surfaceHover
          : theme.colors.whiteOverlayMedium};
      border-color: ${({ theme, isScrolled }) =>
        isScrolled ? theme.colors.primary : theme.colors.whiteOverlayMedium};
      box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryFocus};
    outline-offset: 2px;
  }

  &[aria-expanded="true"] {
    background: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.surfaceHover : theme.colors.whiteOverlayMedium};
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border: 2px solid currentColor;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid
    ${({ theme, isScrolled }) =>
      isScrolled ? "transparent" : `${theme.colors.white}`};

  @media (min-width: 640px) {
    width: 3rem;
    height: 3rem;
    font-size: 1rem;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  display: none;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  flex: 1;

  @media (min-width: 640px) {
    display: flex;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 1rem;
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    max-width: 150px;
  }
`;

const UserRole = styled.span`
  font-size: 0.875rem;
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textSecondary : theme.colors.whiteOverlayStrong};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;

  @media (min-width: 768px) {
    font-size: 1rem;
    max-width: 150px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.colors.dropdownShadow};
  min-width: 220px;
  max-width: 300px;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);

  /* Mobile adjustments */
  @media (max-width: 640px) {
    right: -1rem;
    left: -1rem;
    min-width: auto;
    max-width: none;
    width: calc(100vw - 2rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      opacity 0.2s ease,
      visibility 0.2s ease;
    transform: none;
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    border: 2px solid currentColor;
    box-shadow: none;
  }
`;

const MenuSection = styled.div`
  padding: 0.5rem 0;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 450;
  min-height: 44px; /* Minimum touch target */

  @media (min-width: 640px) {
    font-size: 1.2rem;
    padding: 0.75rem 1.25rem;
    min-height: auto;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryFocus};
    outline-offset: -2px;
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.danger {
    color: ${({ theme }) => theme.colors.danger};

    &:hover,
    &:focus-visible {
      background: ${({ theme }) => theme.colors.dangerHover10};
      color: ${({ theme }) => theme.colors.danger};
    }
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;

    @media (min-width: 640px) {
      width: 1rem;
      height: 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    border: 1px solid transparent;

    &:focus-visible {
      border-color: currentColor;
      outline: none;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0.5rem 0;

  @media (prefers-contrast: high) {
    background: currentColor;
    opacity: 0.3;
  }
`;

// Screen reader only text for better accessibility
const VisuallyHidden = styled.span`
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
`;

const UserProfileMenu = ({ isScrolled = false }) => {
  const { user, isOpen, menuRef, triggerRef, toggleMenu } = useProfileMenu();
  const { displayName, userRole, initials, isAdmin } = useUserDisplay(user);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Memoize navigation functions to prevent unnecessary re-renders
  const handleProfileClick = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  const handleSettingsClick = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  const handleAdminClick = useCallback(() => {
    navigate("/admin");
  }, [navigate]);

  const handleLogOut = useCallback(async () => {
    try {
      const { error } = await logout();
      if (!error) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // You might want to show a toast notification here
    }
  }, [logout, navigate]);

  if (!user) {
    return null;
  }

  const menuId = "user-profile-menu";
  const triggerId = "user-profile-menu-trigger";

  return (
    <ProfileMenuContainer ref={menuRef}>
      <MenuTrigger
        id={triggerId}
        ref={triggerRef}
        onClick={toggleMenu}
        isScrolled={isScrolled}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        aria-label={`User menu for ${displayName}. ${isOpen ? "Press Escape to close" : "Press Enter or Space to open"}`}
        type="button"
      >
        <Avatar isScrolled={isScrolled}>
          {user.photoURL ? (
            <AvatarImage
              src={user.photoURL}
              alt=""
              loading="lazy"
              onError={e => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          {!user.photoURL && (
            <span aria-label={`${displayName} avatar`}>{initials}</span>
          )}
        </Avatar>

        <UserInfo>
          <UserName isScrolled={isScrolled}>{displayName}</UserName>
          <UserRole isScrolled={isScrolled}>{userRole}</UserRole>
        </UserInfo>

        <VisuallyHidden>
          {isOpen ? "Menu expanded" : "Menu collapsed"}
        </VisuallyHidden>
      </MenuTrigger>

      <DropdownMenu
        isOpen={isOpen}
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
      >
        <MenuSection role="group" aria-label="Account options">
          <MenuItem
            onClick={handleProfileClick}
            role="menuitem"
            aria-label="Go to profile page"
          >
            <User aria-hidden="true" />
            Profile
          </MenuItem>

          <MenuItem
            onClick={handleSettingsClick}
            role="menuitem"
            aria-label="Go to settings page"
          >
            <Settings aria-hidden="true" />
            Settings
          </MenuItem>

          {isAdmin && (
            <MenuItem
              onClick={handleAdminClick}
              role="menuitem"
              aria-label="Go to admin panel"
            >
              <Shield aria-hidden="true" />
              Admin Panel
            </MenuItem>
          )}
        </MenuSection>

        <Divider role="separator" />

        <MenuSection role="group" aria-label="Session options">
          <MenuItem
            className="danger"
            onClick={handleLogOut}
            role="menuitem"
            aria-label="Sign out of your account"
          >
            <LogOut aria-hidden="true" />
            Sign Out
          </MenuItem>
        </MenuSection>
      </DropdownMenu>
    </ProfileMenuContainer>
  );
};

export default React.memo(UserProfileMenu);
