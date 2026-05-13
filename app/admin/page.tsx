"use client";

import Link from "next/link";
import { BookOpen, FileText, UploadCloud } from "lucide-react";
import AdminPapersManager from "@/components/AdminPapersManager";
import GlassCard from "@/components/GlassCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePapers } from "@/hooks/usePapers";
import { useSubjects } from "@/hooks/useSubjects";

export default function AdminDashboardPage() {
  const { subjects } = useSubjects();
  const { papers } = usePapers();

  return (
    <main className="page-shell">
      <ProtectedRoute>
        <section className="mb-8">
          <p className="section-kicker">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-50">
            Dashboard
          </h1>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="p-5">
            <BookOpen className="h-5 w-5 text-teal-200" aria-hidden="true" />
            <p className="mt-4 text-3xl font-semibold text-stone-50">
              {subjects.length}
            </p>
            <p className="mt-1 text-sm text-stone-300">Subjects</p>
          </GlassCard>
          <GlassCard className="p-5">
            <FileText className="h-5 w-5 text-amber-200" aria-hidden="true" />
            <p className="mt-4 text-3xl font-semibold text-stone-50">
              {papers.length}
            </p>
            <p className="mt-1 text-sm text-stone-300">Papers</p>
          </GlassCard>
          <Link href="/admin/upload" className="glass-panel p-5 transition hover:bg-white/10">
            <UploadCloud className="h-5 w-5 text-teal-200" aria-hidden="true" />
            <p className="mt-4 font-semibold text-stone-50">Upload PDF</p>
            <p className="mt-1 text-sm text-stone-300">Add a new paper</p>
          </Link>
          <Link href="/admin/subjects" className="glass-panel p-5 transition hover:bg-white/10">
            <BookOpen className="h-5 w-5 text-amber-200" aria-hidden="true" />
            <p className="mt-4 font-semibold text-stone-50">Subjects</p>
            <p className="mt-1 text-sm text-stone-300">Add or delete subjects</p>
          </Link>
        </section>

        <section>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Papers</p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-50">
                Manage uploads
              </h2>
            </div>
          </div>
          <AdminPapersManager />
        </section>
      </ProtectedRoute>
    </main>
  );
}
