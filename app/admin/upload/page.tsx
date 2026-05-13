"use client";

import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ProtectedRoute from "@/components/ProtectedRoute";
import UploadForm from "@/components/UploadForm";
import { useSubjects } from "@/hooks/useSubjects";

export default function UploadPage() {
  const { subjects, loading, error } = useSubjects();

  return (
    <main className="page-shell">
      <ProtectedRoute>
        <section className="mb-6">
          <p className="section-kicker">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-50">
            Upload PDF
          </h1>
        </section>

        {error ? (
          <EmptyState title="Could not load subjects" description={error} />
        ) : loading ? (
          <LoadingSkeleton count={2} />
        ) : subjects.length === 0 ? (
          <EmptyState
            title="No subjects available"
            description="Add subjects before uploading papers."
          />
        ) : (
          <UploadForm subjects={subjects} />
        )}
      </ProtectedRoute>
    </main>
  );
}
