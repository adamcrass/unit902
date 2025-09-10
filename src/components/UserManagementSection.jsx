import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUserAccount,
  USER_ROLES,
  USER_STATUS,
  getUserById,
} from "../services/userService";
import { canEditUser, canDeleteUser } from "../utils/roleUtils";
import { useAuth } from "../contexts/AuthContext";
import AdminUserModal from "./AdminUserModal";
import ConfirmDialog from "./ConfirmDialog";
import PasswordResetDialog from "./PasswordResetDialog";

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div`
  padding: 12px;
  width: 100%;
  max-width: none;
  margin: 0;

  @media (min-width: 768px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 28px;
    gap: 12px;
  }

  svg {
    width: 20px;
    height: 20px;

    @media (min-width: 768px) {
      width: 24px;
      height: 24px;
    }
  }
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;
    justify-content: flex-end;
    width: auto;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
    min-width: 250px;
  }

  @media (min-width: 1024px) {
    min-width: 300px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #6b7280;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const UsersTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: visible;
`;

const TableHeader = styled.div`
  display: none; /* Hidden on mobile - cards don't need headers */

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 200px 140px 120px 80px;
    gap: 16px;
    padding: 16px 20px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    font-size: 14px;
    color: #374151;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 250px 200px 140px 140px 120px 80px;
    gap: 20px;
    padding: 20px 24px;
  }
`;

const TableRow = styled.div`
  /* Mobile: Card layout */
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;

  /* Tablet: Simplified grid */
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 200px 140px 120px 80px;
    gap: 16px;
    padding: 16px 20px;
    align-items: center;
    margin-bottom: 0;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }

  /* Desktop: Full grid */
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 250px 200px 140px 140px 120px 80px;
    gap: 20px;
    padding: 20px 24px;
  }

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  /* Mobile: Enhanced spacing and layout */
  @media (max-width: 767px) {
    gap: 6px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f3f4f6;
  }
`;

// Mobile card header with user info and actions
const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  @media (min-width: 768px) {
    display: none; /* Hidden on tablet+ */
  }
`;

// Mobile card content with badges and details
const MobileCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    display: none; /* Hidden on tablet+ */
  }
`;

// Mobile badge row
const MobileBadgeRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

// Mobile detail row
const MobileDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #6b7280;

  strong {
    color: #374151;
    font-weight: 500;
  }
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;

  @media (max-width: 767px) {
    font-size: 16px;
    font-weight: 600;
  }
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: #6b7280;

  @media (max-width: 767px) {
    font-size: 13px;
  }
`;

const UserJobTitle = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;

  ${props => {
    switch (props.role) {
      case USER_ROLES.ADMIN:
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case USER_ROLES.MANAGER:
        return `
          background: #ddd6fe;
          color: #5b21b6;
        `;
      case USER_ROLES.STAFF:
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      default:
        return `
          background: #e5e7eb;
          color: #374151;
        `;
    }
  }}
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;

  ${props => {
    switch (props.status) {
      case USER_STATUS.ACTIVE:
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case USER_STATUS.INACTIVE:
        return `
          background: #e5e7eb;
          color: #374151;
        `;
      case USER_STATUS.SUSPENDED:
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      default:
        return `
          background: #e5e7eb;
          color: #374151;
        `;
    }
  }}
`;

const LastLogin = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const ActionsContainer = styled.div`
  position: relative;

  /* Mobile: Position in upper right */
  @media (max-width: 767px) {
    position: absolute;
    top: 16px;
    right: 16px;
  }
`;

const ActionsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ActionsMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  min-width: 160px;
  margin-top: 4px;

  /* Mobile: Adjust positioning relative to button */
  @media (max-width: 767px) {
    right: 0;
    top: 40px;
  }
`;

const ActionItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 14px;
  color: #374151;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }

  &:first-of-type {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &.danger {
    color: #dc2626;

    &:hover {
      background: #fef2f2;
    }
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;

    &:hover {
      background: transparent;
    }

    &.danger {
      color: #fca5a5;

      &:hover {
        background: transparent;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #dc2626;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

// ============================================================================
// Main Component
// ============================================================================

const UserManagementSection = () => {
  const { user: currentUser, resetPassword } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Toast notifications
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Fetch current user role
  useEffect(() => {
    const fetchCurrentUserRole = async () => {
      if (currentUser?.uid) {
        try {
          const userData = await getUserById(currentUser.uid);
          setCurrentUserRole(userData?.role || "user");
        } catch (error) {
          console.error("Error fetching current user role:", error);
          setCurrentUserRole("user"); // Default to 'user' role on error
        }
      }
    };

    fetchCurrentUserRole();
  }, [currentUser]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (activeMenu && !event.target.closest("[data-actions-menu]")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  // Filter users when search term or filters change
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = useCallback(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.email?.toLowerCase().includes(lowercaseSearch) ||
          user.displayName?.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = user => {
    setEditingUser(user);
    setShowUserModal(true);
    setActiveMenu(null);
  };

  const handleDeleteUser = user => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
    setActiveMenu(null);
  };

  const handleSendPasswordReset = user => {
    setUserToResetPassword(user);
    setShowPasswordResetDialog(true);
    setActiveMenu(null);
  };

  const handleConfirmPasswordReset = async () => {
    if (!userToResetPassword) return;

    setIsResettingPassword(true);

    try {
      // Using client-side Firebase auth instead of serverless function
      const result = await resetPassword(userToResetPassword.email);

      if (result.success) {
        console.log(
          `Password reset email sent to ${userToResetPassword.email}. The user will receive instructions to create a new password.`
        );

        setShowPasswordResetDialog(false);
        setUserToResetPassword(null);
      } else {
        throw new Error(result.error || "Failed to send password reset email");
      }
    } catch (err) {
      console.error(
        err.message || "Failed to send password reset email. Please try again."
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleCancelPasswordReset = () => {
    if (isResettingPassword) return; // Prevent canceling during request
    setShowPasswordResetDialog(false);
    setUserToResetPassword(null);
  };

  const handleUserSave = async userData => {
    try {
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.id, userData);
      } else {
        // Create new user
        await createUser(userData);
      }

      setShowUserModal(false);
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      throw err; // Let the modal handle the error
    }
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteUserAccount(userToDelete.id);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      await loadUsers();
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  const formatLastLogin = lastLogin => {
    if (!lastLogin) return "Never";

    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;

    return date.toLocaleDateString();
  };

  const toggleActionsMenu = userId => {
    setActiveMenu(activeMenu === userId ? null : userId);
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading users...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <AlertCircle size={48} />
          <div>Failed to load users</div>
          <div style={{ fontSize: "14px" }}>{error}</div>
          <button
            onClick={loadUsers}
            style={{ marginTop: "16px", padding: "8px 16px" }}
          >
            Retry
          </button>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <Users size={32} />
          User Management
        </Title>

        <Controls>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <FilterSelect
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {Object.values(USER_ROLES).map(role => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {Object.values(USER_STATUS).map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </FilterSelect>

          <AddButton onClick={handleCreateUser}>
            <Plus size={18} />
            Add User
          </AddButton>
        </Controls>
      </Header>

      <UsersTable>
        <TableHeader>
          <div>User</div>
          <div>Email</div>
          <div>Job Title</div>
          <div>Role</div>
          <div>Status</div>
          <div>Last Login</div>
          <div>Actions</div>
        </TableHeader>

        {filteredUsers.length === 0 ? (
          <EmptyState>
            {searchTerm || roleFilter || statusFilter
              ? "No users match your filters"
              : "No users found"}
          </EmptyState>
        ) : (
          filteredUsers.map(user => (
            <TableRow key={user.id}>
              <UserInfo>
                <UserName>{user.displayName || "No name"}</UserName>
              </UserInfo>

              <UserEmail>{user.email}</UserEmail>

              <UserJobTitle>{user.jobTitle || "Not specified"}</UserJobTitle>

              <RoleBadge role={user.role}>
                <Shield size={12} />
                {user.role}
              </RoleBadge>

              <StatusBadge status={user.status}>
                {user.status === USER_STATUS.ACTIVE ? (
                  <UserCheck size={12} />
                ) : (
                  <UserX size={12} />
                )}
                {user.status}
              </StatusBadge>

              <LastLogin>{formatLastLogin(user.lastLogin)}</LastLogin>

              <ActionsContainer data-actions-menu>
                <ActionsButton onClick={() => toggleActionsMenu(user.id)}>
                  <MoreVertical size={16} />
                </ActionsButton>

                {activeMenu === user.id && (
                  <ActionsMenu>
                    {canEditUser(
                      currentUserRole,
                      user.role,
                      currentUser?.uid,
                      user.id
                    ) ? (
                      <ActionItem onClick={() => handleEditUser(user)}>
                        <Edit size={14} />
                        Edit
                      </ActionItem>
                    ) : (
                      <ActionItem
                        disabled
                        title="You don't have permission to edit this user"
                      >
                        <Edit size={14} />
                        Edit
                      </ActionItem>
                    )}
                    <ActionItem onClick={() => handleSendPasswordReset(user)}>
                      <Mail size={14} />
                      Reset Password
                    </ActionItem>
                    {canDeleteUser(
                      currentUserRole,
                      user.role,
                      currentUser?.uid,
                      user.id
                    ) ? (
                      <ActionItem
                        className="danger"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </ActionItem>
                    ) : (
                      <ActionItem
                        disabled
                        title="You don't have permission to delete this user"
                      >
                        <Trash2 size={14} />
                        Delete
                      </ActionItem>
                    )}
                  </ActionsMenu>
                )}
              </ActionsContainer>
            </TableRow>
          ))
        )}
      </UsersTable>

      {showUserModal && (
        <AdminUserModal
          user={editingUser}
          onSave={handleUserSave}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          currentUserRole={currentUserRole}
          currentUserId={currentUser?.uid}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete?.displayName || userToDelete?.email}? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={confirmDeleteUser}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setUserToDelete(null);
          }}
          danger
        />
      )}

      {showPasswordResetDialog && (
        <PasswordResetDialog
          user={userToResetPassword}
          onConfirm={handleConfirmPasswordReset}
          onCancel={handleCancelPasswordReset}
          isLoading={isResettingPassword}
        />
      )}
    </Container>
  );
};

export default UserManagementSection;
