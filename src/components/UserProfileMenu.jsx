// src/components/UserProfileMenu.jsx
import React from "react";
import styled from "@emotion/styled";
import { ChevronDown, User, Settings, LogOut, Shield } from "lucide-react";
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
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid
    ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.border : theme.colors.whiteOverlayMedium};
  border-radius: 2rem;
  background: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.surface : theme.colors.whiteOverlayLight};
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 2.5rem;

  &:hover {
    background: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.surfaceHover : theme.colors.whiteOverlayMedium};
    border-color: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.primary : theme.colors.whiteOverlayMedium};
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryFocus};
  }

  &[aria-expanded="true"] {
    background: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.surfaceHover : theme.colors.whiteOverlayMedium};
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
    isScrolled ? theme.colors.textSecondary : theme.colors.whiteOverlayStrong};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const ChevronIcon = styled(ChevronDown)`
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textSecondary : theme.colors.whiteOverlayStrong};
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
  box-shadow: ${({ theme }) => theme.colors.dropdownShadow};
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
    color: ${({ theme }) => theme.colors.danger};

    &:hover,
    &:focus {
      background: ${({ theme }) => theme.colors.dangerHover10};
      color: ${({ theme }) => theme.colors.danger};
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
  const { user, isOpen, menuRef, triggerRef, toggleMenu } = useProfileMenu();
  const { displayName, userRole, initials, isAdmin } = useUserDisplay(user);
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogOut = async () => {
    const { error } = await logout();
    if (!error) {
      navigate("/");
    }
  };

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
            initials
          )}
        </Avatar>

        <UserInfo>
          <UserName isScrolled={isScrolled}>{displayName}</UserName>
          <UserRole isScrolled={isScrolled}>{userRole}</UserRole>
        </UserInfo>

        <ChevronIcon isOpen={isOpen} isScrolled={isScrolled} />
      </MenuTrigger>

      <DropdownMenu isOpen={isOpen}>
        <MenuSection>
          <MenuItem onClick={() => navigate("/profile")}>
            <User />
            Profile
          </MenuItem>

          <MenuItem onClick={() => navigate("/settings")}>
            <Settings />
            Settings
          </MenuItem>

          {isAdmin && (
            <MenuItem onClick={() => navigate("/admin")}>
              <Shield />
              Admin Panel
            </MenuItem>
          )}
        </MenuSection>

        <Divider />

        <MenuSection>
          <MenuItem className="danger" onClick={() => handleLogOut()}>
            <LogOut />
            Sign Out
          </MenuItem>
        </MenuSection>
      </DropdownMenu>
    </ProfileMenuContainer>
  );
};

export default UserProfileMenu;
