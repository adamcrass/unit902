// src/services/userService.js
import { auth, db } from '../config/firebase';
import { ref, get, set, remove, update } from 'firebase/database';

export const userService = {
  // Get all users by combining Firebase Auth data with Realtime Database metadata
  async getAllUsers() {
    try {
      // Get extended metadata from Realtime Database
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      
      const userMetadata = snapshot.exists() ? snapshot.val() : {};
      // Get current user from Firebase Auth to access real email
      const currentUser = auth.currentUser;
      
      // In a production app, you'd fetch all Firebase Auth users via Admin SDK on backend
      // For now, we'll show the current user with their real email and others as placeholders
      const combinedUsers = Object.keys(userMetadata).map(uid => {
        const metadata = userMetadata[uid];
        const isCurrentUser = currentUser && currentUser.uid === uid;
        
        return {
          id: uid,
          // Core data from Firebase Auth - use real email for current user
          email: isCurrentUser ? currentUser.email : 'user@example.com',
          emailVerified: isCurrentUser ? currentUser.emailVerified : false,
          // Extended metadata from Realtime Database
          displayName: metadata.displayName || (isCurrentUser ? currentUser.displayName : 'Unknown User'),
          role: metadata.role || 'user',
          status: metadata.status || 'active',
          createdAt: metadata.createdAt,
          lastLogin: metadata.lastLogin,
          updatedAt: metadata.updatedAt,
          avatar: this.generateAvatar(metadata.displayName || (isCurrentUser ? currentUser.displayName : 'Unknown User'))
        };
      });
      
      // If current user has metadata but isn't in the list, add them
      if (currentUser && !userMetadata[currentUser.uid]) {
        combinedUsers.push({
          id: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
          displayName: currentUser.displayName || 'Unknown User',
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          avatar: this.generateAvatar(currentUser.displayName)
        });
      }
      return combinedUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create extended user metadata (not duplicating Firebase Auth data)
  async createUserMetadata(uid, authUserData) {
    try {
      const userRef = ref(db, `users/${uid}`);
      await set(userRef, {
        displayName: authUserData.displayName || authUserData.email || 'Unknown User',
        role: 'user', // Default role
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating user metadata:', error);
      throw error;
    }
  },

  // Update extended user metadata only (not Firebase Auth data)
  async updateUser(uid, updates) {
    try {
      const userRef = ref(db, `users/${uid}`);
      // Only allow updates to extended metadata fields
      const allowedFields = ['displayName', 'role', 'status'];
      const filteredUpdates = {};
      
      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });
      
      await update(userRef, {
        ...filteredUpdates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user metadata (Note: This doesn't delete the Firebase Auth user)
  async deleteUser(uid) {
    try {
      const userRef = ref(db, `users/${uid}`);
      await remove(userRef);
      // Note: In production, you'd also need to delete the Firebase Auth user
      // via Admin SDK on the backend
    } catch (error) {
      console.error('Error deleting user metadata:', error);
      throw error;
    }
  },

  // Update last login time
  async updateLastLogin(uid) {
    try {
      const userRef = ref(db, `users/${uid}`);
      await update(userRef, {
        lastLogin: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      // Don't throw error for this non-critical operation
    }
  },

  // Generate avatar initials
  generateAvatar(name) {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  },

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
};
