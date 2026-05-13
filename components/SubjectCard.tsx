"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { Subject } from "@/types/subject";

export default function SubjectCard({ subject }: { subject: Subject }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = subject.name.slice(0, 3).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
    >
      <Link
        href={`/subject/${subject.id}`}
        className="glass-panel glass-panel-interactive block h-full p-5"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-black/20">
            {subject.icon && !imageFailed ? (
              <img
                src={subject.icon}
                alt=""
                className="h-9 w-9 object-contain"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span className="text-sm font-bold text-teal-100">
                {initials}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-stone-200">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            {subject.paperCount ?? 0}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-stone-50">{subject.name}</h3>
        <p className="mt-2 text-sm text-stone-300">
          {(subject.paperCount ?? 0) === 1
            ? "1 uploaded paper"
            : `${subject.paperCount ?? 0} uploaded papers`}
        </p>
      </Link>
    </motion.div>
  );
}
