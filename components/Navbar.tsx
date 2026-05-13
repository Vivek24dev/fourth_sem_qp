"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import {
  BookOpen,
  Home,
  LogIn,
  LogOut,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { logout, useAuth } from "@/hooks/useAuth";

const baseLinks = [{ href: "/", label: "Home", icon: Home }];
const adminLinks = [
  { href: "/admin", label: "Admin", icon: ShieldCheck },
  { href: "/admin/upload", label: "Upload", icon: UploadCloud },
  { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const links = isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;

  async function handleLogout() {
    await logout();
    toast.success("Signed out");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-stone-950/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-200/30 bg-teal-200/15 text-sm font-bold text-teal-100">
              QP
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-100">
              Fourth Sem
            </span>
          </Link>

          {user ? (
            <button
              type="button"
              className="button-secondary"
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link href="/login" className="button-primary" title="Login">
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span>Login</span>
            </Link>
          )}
        </div>

        <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  isActive
                    ? "border-teal-200/50 bg-teal-200/15 text-teal-100"
                    : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
