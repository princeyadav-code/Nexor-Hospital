import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  googleProvider,
  syncUserProfile,
  fetchUserProfile,
  saveAppointmentToFirestore,
  fetchUserAppointmentsFromFirestore,
} from '../firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { UserProfile, Appointment } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isLoadingAuth: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  isPatientPortalOpen: boolean;
  userAppointments: Appointment[];
  openAuthModal: (mode?: 'signin' | 'signup', onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  openPatientPortal: () => void;
  closePatientPortal: () => void;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    pass: string,
    profileData: {
      name: string;
      phone: string;
      age: number;
      gender: 'Male' | 'Female' | 'Other';
      bloodGroup?: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<boolean>;
  refreshUserAppointments: () => Promise<void>;
  addUserAppointmentLocal: (apt: Appointment) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isPatientPortalOpen, setIsPatientPortalOpen] = useState(false);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [pendingSuccessCallback, setPendingSuccessCallback] = useState<(() => void) | null>(null);

  // Listen to Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await syncUserProfile(currentUser);
          setUserProfile(profile);
          // Fetch user's appointments
          const apts = await fetchUserAppointmentsFromFirestore(currentUser.uid);
          setUserAppointments(apts);
        } catch (err) {
          console.warn('Profile sync notice:', err);
        }
      } else {
        setUserProfile(null);
        setUserAppointments([]);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin', onSuccess?: () => void) => {
    setAuthModalMode(mode);
    if (onSuccess) {
      setPendingSuccessCallback(() => onSuccess);
    } else {
      setPendingSuccessCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingSuccessCallback(null);
  };

  const openPatientPortal = () => setIsPatientPortalOpen(true);
  const closePatientPortal = () => setIsPatientPortalOpen(false);

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (pendingSuccessCallback) {
      pendingSuccessCallback();
      setPendingSuccessCallback(null);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const profile = await syncUserProfile(res.user);
        setUserProfile(profile);
        handleAuthSuccess();
        return { success: true };
      }
      return { success: false, error: 'Could not complete Google Sign-In' };
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      return { success: false, error: err.message || 'Google sign-in failed' };
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        const profile = await syncUserProfile(res.user);
        setUserProfile(profile);
        handleAuthSuccess();
        return { success: true };
      }
      return { success: false, error: 'Sign in failed' };
    } catch (err: any) {
      console.error('Email sign in error:', err);
      let errorMsg = 'Invalid email or password';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect email or password. Please check your credentials.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    profileData: {
      name: string;
      phone: string;
      age: number;
      gender: 'Male' | 'Female' | 'Other';
      bloodGroup?: string;
    }
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: profileData.name });
        const profile = await syncUserProfile(res.user, profileData);
        setUserProfile(profile);
        handleAuthSuccess();
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err: any) {
      console.error('Sign up error:', err);
      let errorMsg = 'Failed to create patient account';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password must be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setUserProfile(null);
      setUserAppointments([]);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    try {
      const updated = await syncUserProfile(user, data);
      setUserProfile(updated);
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      return false;
    }
  };

  const refreshUserAppointments = async () => {
    if (!user) return;
    try {
      const apts = await fetchUserAppointmentsFromFirestore(user.uid);
      setUserAppointments(apts);
    } catch (err) {
      console.error('Fetch appointments error:', err);
    }
  };

  const addUserAppointmentLocal = (apt: Appointment) => {
    setUserAppointments((prev) => [apt, ...prev.filter((a) => a.id !== apt.id)]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoadingAuth,
        isAuthModalOpen,
        authModalMode,
        isPatientPortalOpen,
        userAppointments,
        openAuthModal,
        closeAuthModal,
        openPatientPortal,
        closePatientPortal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateProfileData,
        refreshUserAppointments,
        addUserAppointmentLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
