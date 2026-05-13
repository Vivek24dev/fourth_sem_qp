"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import SearchBar from "@/components/SearchBar";
import SubjectCard from "@/components/SubjectCard";
import { useSubjects } from "@/hooks/useSubjects";

export default function HomePage() {
  const { subjects, loading, error } = useSubjects();
  const [search, setSearch] = useState("");

  const filteredSubjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return subjects;
    }

    return subjects.filter((subject) =>
      subject.name.toLowerCase().includes(term),
    );
  }, [search, subjects]);

  return (
    <main className="page-shell">
      <motion.section
        className="mb-8 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <p className="section-kicker">Question Papers</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-stone-50 sm:text-5xl">
            Fourth semester study library
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300">
            Browse subjects, preview PDFs, and keep download counts synced with
            Firestore.
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search subjects"
        />
      </motion.section>

      <section>
        <div className="section-heading">
          <div>
            <p className="section-kicker">Subjects</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-50">
              Semester collection
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-300">
            <BookOpenCheck className="h-4 w-4 text-teal-200" aria-hidden="true" />
            {subjects.length} subjects
          </div>
        </div>

        {error ? (
          <EmptyState title="Could not load subjects" description={error} />
        ) : loading ? (
          <LoadingSkeleton />
        ) : filteredSubjects.length === 0 ? (
          <EmptyState
            title="No matching subjects"
            description="Try another search or add subjects from the admin dashboard."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
