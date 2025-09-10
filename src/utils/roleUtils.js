// utils/roleUtils.js
// Role hierarchy utility functions for frontend permission checks

// User roles (must match backend constants)
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  USER: 'user',
};

// Role hierarchy levels (higher number = higher privilege)
const ROLE_HIERARCHY = {
  [USER_ROLES.USER]: 1,
  [USER_ROLES.STAFF]: 2,
  [USER_ROLES.MANAGER]: 3,
  [USER_ROLES.ADMIN]: 4,
};

/**
 * Check if user can manage target role
 * Users can only manage roles at their level or below
 */
export const canManageRole = (userRole, targetRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;

  return userLevel >= targetLevel;
};

/**
 * Check if user can assign target role
 * Admins can assign any role, Managers can only assign staff and user roles
 */
export const canAssignRole = (userRole, targetRole) => {
  // Admins can assign any role
  if (userRole === USER_ROLES.ADMIN) {
    return true;
  }

  // Managers can only assign staff and user roles
  if (userRole === USER_ROLES.MANAGER) {
    return targetRole === USER_ROLES.STAFF || targetRole === USER_ROLES.USER;
  }

  return false;
};

/**
 * Check if user can edit another user
 */
export const canEditUser = (currentUserRole, targetUserRole) => {
  // Can't manage users above your level
  if (!canManageRole(currentUserRole, targetUserRole)) {
    return false;
  }

  return true;
};

/**
 * Check if user can delete another user
 */
export const canDeleteUser = (
  currentUserRole,
  targetUserRole,
  currentUserId,
  targetUserId,
) => {
  // Can't delete yourself
  if (currentUserId === targetUserId) {
    return false;
  }

  // Can't manage users above your level
  if (!canManageRole(currentUserRole, targetUserRole)) {
    return false;
  }

  return true;
};

/**
 * Check if user can elevate role (for role selection in forms)
 */
export const canElevateToRole = (
  currentUserRole,
  targetRole,
  isOwnAccount = false,
) => {
  // Can't elevate your own role
  if (
    isOwnAccount &&
    ROLE_HIERARCHY[targetRole] > ROLE_HIERARCHY[currentUserRole]
  ) {
    return false;
  }

  // Check if user can assign this role
  return canAssignRole(currentUserRole, targetRole);
};

/**
 * Get available roles that a user can assign
 */
export const getAssignableRoles = (userRole) => {
  const roles = [];

  if (userRole === USER_ROLES.ADMIN) {
    // Admins can assign any role
    roles.push(
      USER_ROLES.ADMIN,
      USER_ROLES.MANAGER,
      USER_ROLES.STAFF,
      USER_ROLES.USER,
    );
  } else if (userRole === USER_ROLES.MANAGER) {
    // Managers can only assign staff and user roles
    roles.push(USER_ROLES.STAFF, USER_ROLES.USER);
  }

  return roles;
};

/**
 * Get available roles for editing a specific user
 */
export const getEditableRoles = (
  currentUserRole,
  targetUserId,
  currentUserId,
) => {
  const isOwnAccount = targetUserId === currentUserId;
  const assignableRoles = getAssignableRoles(currentUserRole);

  if (isOwnAccount) {
    // For own account, can't elevate role
    return assignableRoles.filter(
      (role) => ROLE_HIERARCHY[role] <= ROLE_HIERARCHY[currentUserRole],
    );
  }

  return assignableRoles;
};
