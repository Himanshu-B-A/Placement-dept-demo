import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, secondaryAuth, db } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid, email) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserRole(data.role);
        setUserName(data.name || data.email);
        return data.role;
      } else {
        const defaultRole = email === 'admin@jjmmc.com' || email === 'admin@jjmc.com' ? 'admin' : 'student';
        const userData = {
          email,
          role: defaultRole,
          name: email.split('@')[0],
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', uid), userData);
        setUserRole(defaultRole);
        setUserName(userData.name);
        return defaultRole;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const role = await fetchUserData(userCredential.user.uid, email);
      return { success: true, user: userCredential.user, role };
    } catch (error) {
      console.error('Firebase login failed:', error.code, error.message);
      let errorMessage = 'Failed to log in';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        default:
          errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  // Uses a secondary Firebase app so creating a user does NOT sign out the admin
  const register = async (email, password, name, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.uid || 'admin'
      });
      await signOut(secondaryAuth);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Registration failed:', error);
      let errorMessage = 'Failed to create user';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        default:
          errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset failed:', error);
      let errorMessage = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setUserRole(null);
      setUserName('');
    }
    return { success: true };
  };

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      try {
        if (user) {
          setCurrentUser(user);
          const role = await fetchUserData(user.uid, user.email);
          if (isMounted && role) setUserRole(role);
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setUserName('');
        }
      } catch (error) {
        console.error('Auth state error:', error);
        if (isMounted) {
          setCurrentUser(null);
          setUserRole(null);
          setUserName('');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-pink-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-semibold text-lg">JJMMC</p>
          <p className="text-gray-500 text-sm">Loading patient system...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, userRole, userName, login, logout, register, forgotPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
