// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { userService } from '../services/userService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email/Password Sign In
  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };

  // Email/Password Sign Up
  const signUpWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Create user metadata in Realtime Database
      await userService.createUserMetadata(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName
      });
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Create user metadata if this is a new user
      try {
        await userService.createUserMetadata(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName
        });
      } catch (metadataError) {
        // User metadata might already exist, that's okay
        console.log('User metadata may already exist');
      }
      // Update last login
      await userService.updateLastLogin(result.user.uid);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
