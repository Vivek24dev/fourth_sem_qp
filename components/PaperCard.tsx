"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Download, Eye, FileText } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { trackDownload } from "@/lib/trackDownload";
import type { Paper } from "@/types/paper";

export default function PaperCard({ paper }: { paper: Paper }) {
  async function handleDownload() {
    try {
      await trackDownload(paper.id);
      window.open(paper.pdfUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Download failed");
    }
  }

  return (
    <motion.article
      className="glass-panel glass-panel-interactive flex h-full flex-col justify-between p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-teal-100">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold leading-6 text-stone-50">
          {paper.title}
        </h3>
        <p className="mt-2 text-sm text-stone-300">
          Uploaded {formatDate(paper.uploadedAt)}
        </p>
        <p className="mt-1 text-sm text-stone-400">
          {paper.downloadCount} downloads
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/viewer/${paper.id}`} className="button-secondary">
          <Eye className="h-4 w-4" aria-hidden="true" />
          Preview
        </Link>
        <button type="button" className="button-primary" onClick={handleDownload}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Download
        </button>
      </div>
    </motion.article>
  );
}
