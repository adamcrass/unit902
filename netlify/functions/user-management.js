// netlify/functions/user-management.js
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Use production credentials
    let serviceAccountKey = process.env.VITE_PUBLIC_FIREBASE_SA_JSON;

    console.log("Firebase initialization attempt:", {
      hasPublicSA: !!process.env.VITE_PUBLIC_FIREBASE_SA_JSON,
      hasApiKey: !!process.env.VITE_FIREBASE_API_KEY,
      hasAuthDomain: !!process.env.VITE_FIREBASE_AUTH_DOMAIN,
      hasDatabaseURL: !!process.env.VITE_FIREBASE_DATABASE_URL,
      hasProjectId: !!process.env.VITE_FIREBASE_PROJECT_ID,
      usingCredentials: serviceAccountKey ? "found" : "missing",
    });

    if (!serviceAccountKey) {
      throw new Error(
        "Firebase service account key not found in environment variables. Please set VITE_PUBLIC_FIREBASE_SA_JSON"
      );
    }

    const serviceAccount = JSON.parse(serviceAccountKey);
    const databaseURL = process.env.VITE_FIREBASE_DATABASE_URL;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: databaseURL,
    });

    console.log("Firebase Admin initialized successfully");
    console.log(`Database URL: ${databaseURL}`);
    console.log("Using credentials from: VITE_PUBLIC_FIREBASE_SA_JSON");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

const db = admin.database();
const auth = admin.auth();

// User roles and status constants
const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  USER: "user",
};

const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
};

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.VITE_CORS_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Role hierarchy levels (higher number = higher privilege)
const ROLE_HIERARCHY = {
  [USER_ROLES.USER]: 1,
  [USER_ROLES.STAFF]: 2,
  [USER_ROLES.MANAGER]: 3,
  [USER_ROLES.ADMIN]: 4,
};

// Check if user can manage target role
const canManageRole = (userRole, targetRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;

  // Users can only manage roles at their level or below
  return userLevel >= targetLevel;
};

// Check if user can assign target role
const canAssignRole = (userRole, targetRole) => {
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

// Verify admin permissions (for admin-only operations)
const verifyAdminAccess = async authHeader => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No authorization token provided");
  }

  const token = authHeader.substring(7);
  const decodedToken = await auth.verifyIdToken(token);

  // Get user role from database
  const userRef = db.ref(`users/${decodedToken.uid}`);
  const snapshot = await userRef.once("value");
  const userData = snapshot.val();

  if (
    !userData ||
    (userData.role !== USER_ROLES.ADMIN && userData.role !== USER_ROLES.MANAGER)
  ) {
    const currentRole = userData?.role || "unknown";
    throw new Error(
      `Access denied. User management requires Admin or Manager permissions. Current role: ${currentRole}`
    );
  }

  return { uid: decodedToken.uid, role: userData.role };
};

// Verify user authentication (for any authenticated user)
const verifyUserAccess = async authHeader => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No authorization token provided");
  }

  const token = authHeader.substring(7);
  const decodedToken = await auth.verifyIdToken(token);

  // Get user role from database
  const userRef = db.ref(`users/${decodedToken.uid}`);
  const snapshot = await userRef.once("value");
  const userData = snapshot.val();

  if (!userData) {
    throw new Error("User not found in database");
  }

  return { uid: decodedToken.uid, role: userData.role, userData };
};

// Check if user can access specific user data
const canAccessUser = (currentUserRole, currentUserId, targetUserId) => {
  // Users can always access their own data
  if (currentUserId === targetUserId) {
    return true;
  }

  // Admins and managers can access other users
  return (
    currentUserRole === USER_ROLES.ADMIN ||
    currentUserRole === USER_ROLES.MANAGER
  );
};

// Fetch all users
const fetchUsers = async () => {
  const usersRef = db.ref("users");
  const snapshot = await usersRef.once("value");

  if (snapshot.exists()) {
    const usersData = snapshot.val();
    return Object.keys(usersData).map(key => ({
      id: key,
      ...usersData[key],
    }));
  }
  return [];
};

// Create a new user
const createUser = async (userData, currentUserRole) => {
  const {
    email,
    password,
    displayName,
    jobTitle,
    role = USER_ROLES.USER,
    status = USER_STATUS.ACTIVE,
  } = userData;

  // Check if current user can assign this role
  if (!canAssignRole(currentUserRole, role)) {
    throw new Error(
      `Access denied. ${currentUserRole} users cannot assign ${role} role. You can only assign roles below your level.`
    );
  }

  // Create user in Firebase Auth
  const userRecord = await auth.createUser({
    email,
    password,
    displayName,
    emailVerified: false,
  });

  // Set custom claims for the new user
  try {
    await auth.setCustomUserClaims(userRecord.uid, { role });
    console.log(`✅ Set custom claims for user ${email}: role=${role}`);
  } catch (claimsError) {
    console.error(
      `❌ Failed to set custom claims for user ${email}:`,
      claimsError
    );
    // Continue with user creation even if claims fail
  }

  // Store user data in database
  const userDbData = {
    email,
    displayName,
    jobTitle: jobTitle || "",
    role,
    status,
    createdAt: admin.database.ServerValue.TIMESTAMP,
    lastLogin: null,
  };

  await db.ref(`users/${userRecord.uid}`).set(userDbData);

  return {
    id: userRecord.uid,
    ...userDbData,
  };
};

// Update user
const updateUser = async (userId, updates, currentUserRole, currentUserId) => {
  const userRef = db.ref(`users/${userId}`);

  // Get target user's current data
  const snapshot = await userRef.once("value");
  const targetUser = snapshot.val();

  if (!targetUser) {
    throw new Error("User not found");
  }

  // Check if current user can manage the target user
  if (!canManageRole(currentUserRole, targetUser.role)) {
    throw new Error(
      `Access denied. ${currentUserRole} users cannot manage ${targetUser.role} users.`
    );
  }

  // If role is being updated, check permissions
  if (updates.role) {
    // Prevent users from elevating their own role
    if (
      userId === currentUserId &&
      ROLE_HIERARCHY[updates.role] > ROLE_HIERARCHY[currentUserRole]
    ) {
      throw new Error("Access denied. You cannot elevate your own role.");
    }

    // Check if current user can assign the new role
    if (!canAssignRole(currentUserRole, updates.role)) {
      throw new Error(
        `Access denied. ${currentUserRole} users cannot assign ${updates.role} role.`
      );
    }
  }

  // Update in database
  await userRef.update({
    ...updates,
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  });

  // Update in Auth if display name changed
  if (updates.displayName) {
    await auth.updateUser(userId, {
      displayName: updates.displayName,
    });
  }

  // Update custom claims if role changed
  if (updates.role && updates.role !== targetUser.role) {
    try {
      await auth.setCustomUserClaims(userId, { role: updates.role });
      console.log(
        `✅ Updated custom claims for user ${targetUser.email}: role=${updates.role}`
      );
    } catch (claimsError) {
      console.error(
        `❌ Failed to update custom claims for user ${targetUser.email}:`,
        claimsError
      );
      // Continue with user update even if claims fail
    }
  }

  // Get updated user data
  const updatedSnapshot = await userRef.once("value");
  return {
    id: userId,
    ...updatedSnapshot.val(),
  };
};

// Delete user
const deleteUser = async (userId, currentUserRole, currentUserId) => {
  // Prevent users from deleting themselves
  if (userId === currentUserId) {
    throw new Error("Access denied. You cannot delete your own account.");
  }

  // Get target user's data
  const userRef = db.ref(`users/${userId}`);
  const snapshot = await userRef.once("value");
  const targetUser = snapshot.val();

  if (!targetUser) {
    throw new Error("User not found");
  }

  // Check if current user can manage the target user
  if (!canManageRole(currentUserRole, targetUser.role)) {
    throw new Error(
      `Access denied. ${currentUserRole} users cannot delete ${targetUser.role} users.`
    );
  }

  // Delete from Auth
  await auth.deleteUser(userId);

  // Delete from database
  await userRef.remove();

  return { success: true };
};

// Get user by ID
const getUserById = async userId => {
  const userRef = db.ref(`users/${userId}`);
  const snapshot = await userRef.once("value");

  if (snapshot.exists()) {
    return {
      id: userId,
      ...snapshot.val(),
    };
  }
  return null;
};

// Search users
const searchUsers = async searchTerm => {
  const users = await fetchUsers();

  if (!searchTerm) return users;

  const term = searchTerm.toLowerCase();
  return users.filter(
    user =>
      user.email?.toLowerCase().includes(term) ||
      user.displayName?.toLowerCase().includes(term)
  );
};

// Get users by role
const getUsersByRole = async role => {
  const usersRef = db.ref("users");
  const snapshot = await usersRef
    .orderByChild("role")
    .equalTo(role)
    .once("value");

  if (snapshot.exists()) {
    const usersData = snapshot.val();
    return Object.keys(usersData).map(key => ({
      id: key,
      ...usersData[key],
    }));
  }
  return [];
};

exports.handler = async event => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    const { httpMethod, path, headers } = event;
    const authHeader = headers.authorization || headers.Authorization;

    // Parse request body for POST/PUT requests
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    // Extract action from query parameters or body
    const queryParams = new URLSearchParams(event.rawQuery || "");
    const action = queryParams.get("action") || body.action;
    const userId = queryParams.get("userId") || body.userId;

    let result;

    switch (httpMethod) {
      case "GET":
        switch (action) {
          case "fetchUsers":
            // Admin/Manager only operation
            const currentUser = await verifyAdminAccess(authHeader);
            result = await fetchUsers();
            break;

          case "getUserById":
            if (!userId) {
              return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: "User ID is required" }),
              };
            }

            // Use flexible authentication for getUserById
            const userAuth = await verifyUserAccess(authHeader);

            // Check if user can access this specific user data
            if (!canAccessUser(userAuth.role, userAuth.uid, userId)) {
              return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                  error: `Access denied. You can only access your own profile data unless you are an Admin or Manager. Current role: ${userAuth.role}`,
                }),
              };
            }

            const user = await getUserById(userId);
            if (!user) {
              return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ error: "User not found" }),
              };
            }

            return {
              statusCode: 200,
              headers: corsHeaders,
              body: JSON.stringify(user),
            };

          case "searchUsers":
            // Admin/Manager only operation
            const searchCurrentUser = await verifyAdminAccess(authHeader);
            const searchTerm = queryParams.get("searchTerm") || body.searchTerm;
            result = await searchUsers(searchTerm);
            break;

          case "getUsersByRole":
            // Admin/Manager only operation
            const roleCurrentUser = await verifyAdminAccess(authHeader);
            const role = queryParams.get("role") || body.role;
            if (!role) throw new Error("Role is required");
            result = await getUsersByRole(role);
            break;

          default:
            // Admin/Manager only operation
            const defaultCurrentUser = await verifyAdminAccess(authHeader);
            result = await fetchUsers();
        }
        break;

      case "POST":
        switch (action) {
          case "createUser":
            // Admin/Manager only operation
            const createCurrentUser = await verifyAdminAccess(authHeader);
            result = await createUser(body.userData, createCurrentUser.role);
            break;

          default:
            throw new Error("Invalid action for POST request");
        }
        break;

      case "PUT":
        if (action === "updateUser") {
          const updateData = JSON.parse(event.body);
          const { id: updateUserId, ...updates } = updateData;

          if (!updateUserId) {
            return {
              statusCode: 400,
              headers: corsHeaders,
              body: JSON.stringify({ error: "User ID is required" }),
            };
          }

          // Use flexible authentication for updateUser
          const updateUserAuth = await verifyUserAccess(authHeader);

          // Check if user can access this specific user data
          if (
            !canAccessUser(
              updateUserAuth.role,
              updateUserAuth.uid,
              updateUserId
            )
          ) {
            return {
              statusCode: 403,
              headers: corsHeaders,
              body: JSON.stringify({
                error: `Access denied. You can only update your own profile unless you are an Admin or Manager. Current role: ${updateUserAuth.role}`,
              }),
            };
          }

          // If user is updating their own profile, restrict what they can change
          if (
            updateUserAuth.uid === updateUserId &&
            updateUserAuth.role !== USER_ROLES.ADMIN &&
            updateUserAuth.role !== USER_ROLES.MANAGER
          ) {
            // Users can only update certain fields about themselves
            const allowedFields = ["displayName", "jobTitle", "phone"];
            const restrictedUpdates = {};

            for (const [key, value] of Object.entries(updates)) {
              if (allowedFields.includes(key)) {
                restrictedUpdates[key] = value;
              }
            }

            // Prevent users from changing their own role or status
            if (updates.role && updates.role !== updateUserAuth.userData.role) {
              return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                  error: "You cannot change your own role",
                }),
              };
            }

            if (
              updates.status &&
              updates.status !== updateUserAuth.userData.status
            ) {
              return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                  error: "You cannot change your own status",
                }),
              };
            }

            result = await updateUser(
              updateUserId,
              restrictedUpdates,
              updateUserAuth.role,
              updateUserAuth.uid
            );
          } else {
            // Admin/Manager updating other users - use existing logic
            result = await updateUser(
              updateUserId,
              updates,
              updateUserAuth.role,
              updateUserAuth.uid
            );
          }
        } else {
          throw new Error("Invalid action for PUT request");
        }
        break;

      case "DELETE":
        if (action === "deleteUser") {
          // Admin/Manager only operation
          const deleteCurrentUser = await verifyAdminAccess(authHeader);
          if (!userId) throw new Error("User ID is required");
          result = await deleteUser(
            userId,
            deleteCurrentUser.role,
            deleteCurrentUser.uid
          );
        } else {
          throw new Error("Invalid action for DELETE request");
        }
        break;

      default:
        throw new Error("Method not allowed");
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error) {
    console.error("User management error:", error);
    console.error("Error stack:", error.stack);
    console.error("Environment:", process.env.NODE_ENV || "undefined");
    console.error(
      "Netlify Environment:",
      process.env.NETLIFY_ENV || "undefined"
    );

    return {
      statusCode: error.message.includes("permissions")
        ? 403
        : error.message.includes("authorization")
          ? 401
          : 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error.message,
        environment:
          process.env.NODE_ENV || process.env.NETLIFY_ENV || "unknown",
      }),
    };
  }
};
