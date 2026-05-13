"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, isAdmin, isFirebaseConfigured } = useAuth();

  useEffect(() => {
    if (!loading && isFirebaseConfigured && (!user || !isAdmin)) {
      router.replace("/login");
    }
  }, [isAdmin, isFirebaseConfigured, loading, router, user]);

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (!isFirebaseConfigured) {
    return (
      <EmptyState
        title="Firebase is not configured"
        description="Add your Firebase values in .env.local, restart the dev server, then sign in with the admin email."
      />
    );
  }

  if (!user || !isAdmin) {
    return (
      <EmptyState
        title="Admin access required"
        description="Only shreedharmm3@gmail.com can open this page."
      />
    );
  }

  return <>{children}</>;
}
