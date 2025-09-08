// src/components/UserProfileMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { ChevronDown, User, Settings, LogOut, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "../contexts/NavigationContext";

const ProfileMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const MenuTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid
    ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.border : "rgba(255, 255, 255, 0.2)"};
  border-radius: 2rem;
  background: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.surface : "rgba(255, 255, 255, 0.1)"};
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 2.5rem;

  &:hover {
    background: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.surfaceHover : "rgba(255, 255, 255, 0.15)"};
    border-color: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.primary : "rgba(255, 255, 255, 0.3)"};
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
  }

  &[aria-expanded="true"] {
    background: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.surfaceHover : "rgba(255, 255, 255, 0.2)"};
  }
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid
    ${({ theme, isScrolled }) =>
      isScrolled ? "transparent" : `${theme.colors.white}`};
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;

  @media (max-width: 640px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 1.2rem;
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const UserRole = styled.span`
  font-size: 1rem;
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textSecondary : "rgba(255, 255, 255, 0.8)"};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const ChevronIcon = styled(ChevronDown)`
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textSecondary : "rgba(255, 255, 255, 0.8)"};
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  flex-shrink: 0;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.75rem;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 220px;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const MenuSection = styled.div`
  padding: 0.5rem 0;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1.25rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.2rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 450;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.danger {
    color: ${({ theme }) => theme.colors.error || "#ef4444"};

    &:hover,
    &:focus {
      background: ${({ theme }) => theme.colors.error || "#ef4444"}10;
      color: ${({ theme }) => theme.colors.error || "#ef4444"};
    }
  }

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0.5rem 0;
`;

const UserProfileMenu = ({ isScrolled = false }) => {
  const { user, logout } = useAuth();
  const { handleNavigation, handleProfile } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = event => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuAction = action => {
    setIsOpen(false);

    // Small delay to allow menu animation to complete
    setTimeout(() => {
      switch (action) {
        case "profile":
          handleProfile();
          break;
        case "settings":
          // TODO: Navigate to settings page
          console.log("Navigate to settings");
          break;
        case "admin":
          handleNavigation("/admin");
          break;
        case "logout":
          logout();
          break;
        default:
          break;
      }
    }, 100);
  };

  const getInitials = name => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.email?.split("@")[0] || "User";
  };

  const getUserRole = () => {
    return user?.role || "Member";
  };

  if (!user) {
    return null;
  }

  return (
    <ProfileMenuContainer ref={menuRef}>
      <MenuTrigger
        ref={triggerRef}
        onClick={toggleMenu}
        isScrolled={isScrolled}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
      >
        <Avatar isScrolled={isScrolled}>
          {user.photoURL ? (
            <AvatarImage src={user.photoURL} alt="Profile" />
          ) : (
            getInitials(getUserDisplayName())
          )}
        </Avatar>

        <UserInfo>
          <UserName isScrolled={isScrolled}>{getUserDisplayName()}</UserName>
          <UserRole isScrolled={isScrolled}>{getUserRole()}</UserRole>
        </UserInfo>

        <ChevronIcon isOpen={isOpen} isScrolled={isScrolled} />
      </MenuTrigger>

      <DropdownMenu isOpen={isOpen}>
        <MenuSection>
          <MenuItem onClick={() => handleMenuAction("profile")}>
            <User />
            Profile
          </MenuItem>

          <MenuItem onClick={() => handleMenuAction("settings")}>
            <Settings />
            Settings
          </MenuItem>

          {(user.role === "admin" || user.role === "super_admin") && (
            <MenuItem onClick={() => handleMenuAction("admin")}>
              <Shield />
              Admin Panel
            </MenuItem>
          )}
        </MenuSection>

        <Divider />

        <MenuSection>
          <MenuItem
            className="danger"
            onClick={() => handleMenuAction("logout")}
          >
            <LogOut />
            Sign Out
          </MenuItem>
        </MenuSection>
      </DropdownMenu>
    </ProfileMenuContainer>
  );
};

export default UserProfileMenu;
