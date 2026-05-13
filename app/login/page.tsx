"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import GlassCard from "@/components/GlassCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { signInWithGoogle, useAuth } from "@/hooks/useAuth";
import { adminCheck, ADMIN_EMAIL } from "@/lib/adminCheck";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, isAdmin, isFirebaseConfigured } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(isAdmin ? "/admin" : "/");
    }
  }, [isAdmin, loading, router, user]);

  async function handleGoogleLogin() {
    setIsSigningIn(true);

    try {
      const credential = await signInWithGoogle();
      const email = credential.user.email;

      toast.success("Signed in");
      router.replace(adminCheck(email) ? "/admin" : "/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setIsSigningIn(false);
    }
  }

  if (loading) {
    return (
      <main className="page-shell">
        <LoadingSkeleton count={2} />
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-xl">
        {!isFirebaseConfigured ? (
          <EmptyState
            title="Firebase is not configured"
            description="Add the NEXT_PUBLIC_FIREBASE values in .env.local, restart the dev server, then sign in with Google."
          />
        ) : (
          <GlassCard className="p-6">
            <p className="section-kicker">Login</p>
            <h1 className="mt-3 text-3xl font-semibold text-stone-50">
              Sign in with Google
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              {ADMIN_EMAIL} opens the admin dashboard. Other Google accounts can
              browse and download papers.
            </p>

            <button
              type="button"
              className="button-primary mt-6 w-full"
              onClick={handleGoogleLogin}
              disabled={isSigningIn}
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {isSigningIn ? "Signing in..." : "Continue with Google"}
            </button>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
