"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase/auth";
import { isFirebaseConfigured } from "@/firebase/config";
import { adminCheck } from "@/lib/adminCheck";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  return {
    user,
    loading,
    isAdmin: adminCheck(user?.email),
    isFirebaseConfigured,
  };
}

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Add Firebase environment variables before signing in.");
  }

  return signInWithPopup(auth, googleProvider);
}

export async function logout() {
  if (!auth) {
    return;
  }

  await signOut(auth);
}
