"use client";

import { useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link2, UploadCloud } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { addPdfLink, uploadPdf } from "@/lib/uploadPdf";
import type { Subject } from "@/types/subject";

type UploadMode = "file" | "link";

export default function UploadForm({ subjects }: { subjects: Subject[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<UploadMode>("link");
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUploading(true);

    try {
      if (mode === "file") {
        if (!file) {
          toast.error("Choose a PDF file first");
          return;
        }

        await uploadPdf({ subjectId, title, file });
        toast.success("PDF uploaded");
      } else {
        await addPdfLink({ subjectId, title, pdfUrl });
        toast.success("PDF link added");
      }

      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save paper");
    } finally {
      setIsUploading(false);
    }
  }

  function resetForm() {
    setSubjectId("");
    setTitle("");
    setFile(null);
    setPdfUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <GlassCard className="p-5">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="inline-flex rounded-lg border border-white/10 bg-black/20 p-1">
          <button
            type="button"
            className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
              mode === "link"
                ? "bg-teal-200 text-stone-950"
                : "text-stone-300 hover:bg-white/10"
            }`}
            onClick={() => setMode("link")}
          >
            <Link2 className="h-4 w-4" aria-hidden="true" />
            Add PDF link
          </button>
          <button
            type="button"
            className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
              mode === "file"
                ? "bg-teal-200 text-stone-950"
                : "text-stone-300 hover:bg-white/10"
            }`}
            onClick={() => setMode("file")}
          >
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            Upload file
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Subject</span>
            <select
              className="field"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              required
            >
              <option value="" disabled>
                Select subject
              </option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Paper title</span>
            <input
              className="field"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: DBMS Mid Sem 2025"
              required
            />
          </label>
        </div>

        {mode === "link" ? (
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">PDF link</span>
            <input
              className="field"
              type="url"
              value={pdfUrl}
              onChange={(event) => setPdfUrl(event.target.value)}
              placeholder="Paste a public Google Drive PDF link"
              required
            />
          </label>
        ) : (
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">PDF file</span>
            <input
              ref={fileInputRef}
              className="field file:mr-4 file:rounded-lg file:border-0 file:bg-teal-200 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-stone-950"
              type="file"
              accept="application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              required={mode === "file"}
            />
          </label>
        )}

        {mode === "file" ? (
          <p className="text-sm leading-6 text-amber-100">
            Firebase Storage uploads require the Firebase Blaze plan. Use PDF
            links if you want to stay on the free Spark plan.
          </p>
        ) : null}

        <button type="submit" className="button-primary" disabled={isUploading}>
          {mode === "file" ? (
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden="true" />
          )}
          {isUploading
            ? "Saving..."
            : mode === "file"
              ? "Upload PDF"
              : "Add PDF link"}
        </button>
      </form>
    </GlassCard>
  );
}
