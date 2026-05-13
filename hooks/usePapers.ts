"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firestore";
import { paperFromDoc } from "@/lib/getPapers";
import type { Paper } from "@/types/paper";

export function usePapers(subjectId?: string) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const firestore = db;

    if (!firestore) {
      setPapers([]);
      setLoading(false);
      return;
    }

    const papersQuery = query(
      collection(firestore, "papers"),
      orderBy("uploadedAt", "desc"),
    );

    return onSnapshot(
      papersQuery,
      (snapshot) => {
        const nextPapers = snapshot.docs
          .map(paperFromDoc)
          .filter((paper) => !subjectId || paper.subjectId === subjectId);

        setPapers(nextPapers);
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );
  }, [subjectId]);

  return { papers, loading, error };
}
