"use client";

import toast from "react-hot-toast";
import { Download } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { trackDownload } from "@/lib/trackDownload";

type PDFViewerProps = {
  paperId: string;
  src: string;
  title: string;
};

export default function PDFViewer({ paperId, src, title }: PDFViewerProps) {
  async function handleDownload() {
    try {
      await trackDownload(paperId);
      window.open(src, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Download failed");
    }
  }

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-kicker">PDF Viewer</p>
          <h1 className="mt-1 text-xl font-semibold text-stone-50">{title}</h1>
        </div>
        <button type="button" className="button-primary" onClick={handleDownload}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Download
        </button>
      </div>

      <iframe
        className="h-[72vh] w-full bg-white"
        src={src}
        title={title}
        loading="lazy"
      />
    </GlassCard>
  );
}
