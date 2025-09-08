// src/components/UserProfileMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { ChevronDown, User, Package, Settings, LogOut, Home, ShoppingBag } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "../contexts/NavigationContext";

const ProfileMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  border: 1px solid white;
  border-radius: 15px;
  padding: 0 0.5rem;
`;

const Avatar = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }

  &:focus {
    outline: none;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const ChevronIcon = styled(ChevronDown)`
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textPrimary : theme.colors.white};
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  pointer-events: none;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadius.sm};
  box-shadow: 0 10px 25px ${({ theme }) => theme.colors.shadow};
  min-width: 200px;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
`;

const MenuHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.95rem;
`;

const UserEmail = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
`;

const MenuItem = styled.li`
  margin: 0;
`;

const MenuLink = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.surfaceHover};
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = event => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuAction = (action) => {
    setIsOpen(false);
    
    switch (action) {
      case "home":
        handleNavigation("/");
        break;
      case "shop":
        handleNavigation("/shop");
        break;
      case "profile":
        handleProfile();
        break;
      case "orders":
        // TODO: Navigate to orders page
        break;
      case "settings":
        // TODO: Navigate to settings page
        break;
      case "logout":
        logout();
        break;
      default:
        break;
    }
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

  if (!user) {
    return null;
  }

  return (
    <ProfileMenuContainer ref={menuRef}>
      <Avatar
        onClick={toggleMenu}
        isScrolled={isScrolled}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
      >
        {user.photoURL ? (
          <AvatarImage src={user.photoURL} alt="Profile" />
        ) : (
          getInitials(getUserDisplayName())
        )}
      </Avatar>

      <ChevronIcon isOpen={isOpen} isScrolled={isScrolled} />

      <DropdownMenu isOpen={isOpen}>
        <MenuHeader>
          <UserName>{getUserDisplayName()}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </MenuHeader>

        <MenuList>
          <MenuItem>
            <MenuLink onClick={() => handleMenuAction("home")}>
              <User size={16} />
              Home
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink onClick={() => handleMenuAction("shop")}>
              <ShoppingBag size={16} />
              Shop
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink onClick={() => handleMenuAction("profile")}>
              <User size={16} />
              Profile
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink onClick={() => handleMenuAction("orders")}>
              <Package size={16} />
              My Orders
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink onClick={() => handleMenuAction("settings")}>
              <Settings size={16} />
              Settings
            </MenuLink>
          </MenuItem>

          <Divider />

          <MenuItem>
            <MenuLink onClick={() => handleMenuAction("logout")}>
              <LogOut size={16} />
              Sign Out
            </MenuLink>
          </MenuItem>
        </MenuList>
      </DropdownMenu>
    </ProfileMenuContainer>
  );
};

export default UserProfileMenu;
