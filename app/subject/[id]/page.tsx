"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PaperCard from "@/components/PaperCard";
import SearchBar from "@/components/SearchBar";
import { usePapers } from "@/hooks/usePapers";
import { useSubjects } from "@/hooks/useSubjects";

export default function SubjectPage() {
  const params = useParams<{ id: string }>();
  const subjectId = params.id;
  const { subjects } = useSubjects();
  const { papers, loading, error } = usePapers(subjectId);
  const [search, setSearch] = useState("");
  const subject = subjects.find((item) => item.id === subjectId);

  const filteredPapers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return papers;
    }

    return papers.filter((paper) => paper.title.toLowerCase().includes(term));
  }, [papers, search]);

  return (
    <main className="page-shell">
      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="section-kicker">Subject</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-50">
            {subject?.name ?? subjectId.toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-stone-300">
            {papers.length} uploaded papers
          </p>
        </div>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search paper title"
        />
      </section>

      {error ? (
        <EmptyState title="Could not load papers" description={error} />
      ) : loading ? (
        <LoadingSkeleton />
      ) : filteredPapers.length === 0 ? (
        <EmptyState
          title="No papers found"
          description="Upload a paper for this subject or try another search."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </main>
  );
}
