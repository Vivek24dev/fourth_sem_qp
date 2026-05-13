"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, RefreshCcw, Trash2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import GlassCard from "@/components/GlassCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useSubjects } from "@/hooks/useSubjects";
import {
  addSubject,
  deleteSubject,
  seedDefaultSubjects,
} from "@/lib/getSubjects";

export default function SubjectManager() {
  const { subjects, loading } = useSubjects();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  async function handleAddSubject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await addSubject({ name, icon });
      toast.success("Subject added");
      setName("");
      setIcon("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add subject");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSubject(id: string) {
    if (!window.confirm("Delete this subject and its paper records?")) {
      return;
    }

    try {
      await deleteSubject(id);
      toast.success("Subject deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete subject",
      );
    }
  }

  async function handleSeedSubjects() {
    setIsSeeding(true);

    try {
      await seedDefaultSubjects();
      toast.success("Default subjects added");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not add defaults",
      );
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <div className="grid gap-5">
      <GlassCard className="p-5">
        <form className="grid gap-4" onSubmit={handleAddSubject}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">Name</span>
              <input
                className="field"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: ADA"
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">Icon path</span>
              <input
                className="field"
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                placeholder="/icons/ada.png"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="submit" className="button-primary" disabled={isSaving}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {isSaving ? "Adding..." : "Add subject"}
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={handleSeedSubjects}
              disabled={isSeeding}
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              {isSeeding ? "Adding..." : "Add defaults"}
            </button>
          </div>
        </form>
      </GlassCard>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : subjects.length === 0 ? (
        <EmptyState
          title="No subjects yet"
          description="Add a subject or use the default fourth-semester list."
        />
      ) : (
        <div className="grid gap-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="glass-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-semibold text-stone-50">{subject.name}</h3>
                <p className="text-sm text-stone-300">
                  {subject.paperCount ?? 0} papers
                </p>
              </div>
              <button
                type="button"
                className="button-danger"
                onClick={() => handleDeleteSubject(subject.id)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
