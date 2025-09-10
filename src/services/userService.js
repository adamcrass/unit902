import { auth } from '../config/firebase';

/**
 * User Service - Handles all user management operations
 */

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  USER: 'user',
};

// User status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// API base URL
const API_BASE = '/.netlify/functions';

// Helper function to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated. Please log in and try again.');
  }
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw new Error('Failed to get authentication token. Please log in again.');
  }
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  let data;
  if (isJson) {
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const text = await response.text();
      throw new Error(`Invalid JSON response: ${text.substring(0, 200)}...`);
    }
  } else {
    // If not JSON, get text response for better error messages
    const text = await response.text();
    console.error('Non-JSON response received:', {
      status: response.status,
      statusText: response.statusText,
      contentType,
      body: text.substring(0, 500)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed (${response.status}): ${response.statusText}. Response: ${text.substring(0, 200)}...`);
    }
    
    throw new Error(`Expected JSON response but received: ${contentType}. Response: ${text.substring(0, 200)}...`);
  }

  if (!response.ok) {
    throw new Error(data.error || `API request failed (${response.status}): ${response.statusText}`);
  }

  // Handle different response formats
  if (data.body && typeof data.body === 'string') {
    try {
      return JSON.parse(data.body);
    } catch (e) {
      return data.body;
    }
  } else if (data.data !== undefined) {
    return data.data;
  }

  return data;
};

/**
 * Fetch all users from API
 */
export const fetchUsers = async () => {
  try {
    return await apiCall('/user-management?action=fetchUsers');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

/**
 * Create a new user
 */
export const createUser = async (userData) => {
  try {
    return await apiCall('/user-management', {
      method: 'POST',
      body: JSON.stringify({
        action: 'createUser',
        userData,
      }),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message || 'Failed to create user');
  }
};

/**
 * Update user data
 */
export const updateUser = async (userId, updates) => {
  try {
    return await apiCall('/user-management', {
      method: 'PUT',
      body: JSON.stringify({
        action: 'updateUser',
        id: userId, // Changed from userId to id to match backend expectation
        ...updates,
      }),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

/**
 * Delete a user
 */
export const deleteUserAccount = async (userId) => {
  try {
    return await apiCall('/user-management', {
      method: 'DELETE',
      body: JSON.stringify({
        action: 'deleteUser',
        userId,
      }),
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return await apiCall(
      `/user-management?action=getUserById&userId=${userId}`,
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

/**
 * Search users by email or display name
 */
export const searchUsers = async (searchTerm) => {
  try {
    const encodedTerm = encodeURIComponent(searchTerm || '');
    return await apiCall(
      `/user-management?action=searchUsers&searchTerm=${encodedTerm}`,
    );
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role) => {
  try {
    return await apiCall(`/user-management?action=getUsersByRole&role=${role}`);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw new Error('Failed to fetch users by role');
  }
};

/**
 * Update user last login time
 */
export const updateLastLogin = async (userId) => {
  try {
    await updateUser(userId, {
      lastLogin: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    // Don't throw error for this non-critical operation
  }
};
