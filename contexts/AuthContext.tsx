"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
});
/////AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Sync user with database
        await syncUserWithDatabase(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserWithDatabase = async (firebaseUser: User) => {
    try {
      // Call API to create/update user in database
      const response = await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL,
        }),
      });

      if (!response.ok) {
        console.error("Failed to sync user with database");
      }
    } catch (error) {
      console.error("Error syncing user:", error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with full name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Sync with database
      await syncUserWithDatabase(userCredential.user);
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw new Error(error.message || "Failed to create account");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw new Error(error.message || "Failed to sign in");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Sync with database
      await syncUserWithDatabase(result.user);
    } catch (error: any) {
      console.error("Google sign in error:", error);
      throw new Error(error.message || "Failed to sign in with Google");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Failed to logout");
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
