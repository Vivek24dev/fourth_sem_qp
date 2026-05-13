"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Check, Edit3, FileText, Trash2, X } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { usePapers } from "@/hooks/usePapers";
import { useSubjects } from "@/hooks/useSubjects";
import { deletePaper, updatePaperTitle } from "@/lib/getPapers";
import { formatDate } from "@/lib/formatDate";
import type { Paper } from "@/types/paper";

export default function AdminPapersManager() {
  const { papers, loading } = usePapers();
  const { subjects } = useSubjects();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const subjectNameById = useMemo(() => {
    return new Map(subjects.map((subject) => [subject.id, subject.name]));
  }, [subjects]);

  function startEdit(paper: Paper) {
    setEditingId(paper.id);
    setDraftTitle(paper.title);
  }

  async function saveTitle(paperId: string) {
    setSavingId(paperId);

    try {
      await updatePaperTitle(paperId, draftTitle);
      toast.success("Title updated");
      setEditingId(null);
      setDraftTitle("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDeletePaper(paper: Paper) {
    if (!window.confirm("Delete this paper?")) {
      return;
    }

    try {
      await deletePaper(paper);
      toast.success("Paper deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete");
    }
  }

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  if (papers.length === 0) {
    return (
      <EmptyState
        title="No papers uploaded"
        description="Upload a PDF from the admin upload page."
      />
    );
  }

  return (
    <div className="grid gap-3">
      {papers.map((paper) => (
        <div
          key={paper.id}
          className="glass-panel flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex min-w-0 gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-teal-100">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              {editingId === paper.id ? (
                <input
                  className="field"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                />
              ) : (
                <h3 className="truncate font-semibold text-stone-50">
                  {paper.title}
                </h3>
              )}
              <p className="mt-1 text-sm text-stone-300">
                {subjectNameById.get(paper.subjectId) ?? paper.subjectId} ·{" "}
                {formatDate(paper.uploadedAt)} · {paper.downloadCount} downloads
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {editingId === paper.id ? (
              <>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => saveTitle(paper.id)}
                  disabled={savingId === paper.id}
                  title="Save title"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setEditingId(null)}
                  title="Cancel edit"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            ) : (
              <button
                type="button"
                className="icon-button"
                onClick={() => startEdit(paper)}
                title="Edit title"
              >
                <Edit3 className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className="button-danger"
              onClick={() => handleDeletePaper(paper)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
