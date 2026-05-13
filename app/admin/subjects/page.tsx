"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import SubjectManager from "@/components/SubjectManager";

export default function AdminSubjectsPage() {
  return (
    <main className="page-shell">
      <ProtectedRoute>
        <section className="mb-6">
          <p className="section-kicker">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-50">
            Manage subjects
          </h1>
        </section>
        <SubjectManager />
      </ProtectedRoute>
    </main>
  );
}
