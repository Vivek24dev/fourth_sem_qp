"use client";

import { useParams } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PDFViewer from "@/components/PDFViewer";
import { usePapers } from "@/hooks/usePapers";

export default function ViewerPage() {
  const params = useParams<{ id: string }>();
  const { papers, loading, error } = usePapers();
  const paper = papers.find((item) => item.id === params.id);

  return (
    <main className="page-shell">
      {error ? (
        <EmptyState title="Could not load PDF" description={error} />
      ) : loading ? (
        <LoadingSkeleton count={1} />
      ) : !paper ? (
        <EmptyState
          title="Paper not found"
          description="This PDF record does not exist in Firestore."
        />
      ) : (
        <PDFViewer paperId={paper.id} src={paper.pdfUrl} title={paper.title} />
      )}
    </main>
  );
}
