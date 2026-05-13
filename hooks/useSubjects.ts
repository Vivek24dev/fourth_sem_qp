"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firestore";
import { DEFAULT_SUBJECTS, subjectFromDoc } from "@/lib/getSubjects";
import { paperFromDoc } from "@/lib/getPapers";
import type { Paper } from "@/types/paper";
import type { Subject } from "@/types/subject";

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const firestore = db;

    if (!firestore) {
      setSubjects(DEFAULT_SUBJECTS);
      setLoading(false);
      return;
    }

    let latestSubjects: Subject[] = [];
    let latestPapers: Paper[] = [];
    let hasSubjects = false;
    let hasPapers = false;

    function publish() {
      if (!hasSubjects || !hasPapers) {
        return;
      }

      const counts = new Map<string, number>();

      latestPapers.forEach((paper) => {
        counts.set(paper.subjectId, (counts.get(paper.subjectId) ?? 0) + 1);
      });

      setSubjects(
        latestSubjects.map((subject) => ({
          ...subject,
          paperCount: counts.get(subject.id) ?? 0,
        })),
      );
      setLoading(false);
    }

    const subjectsQuery = query(
      collection(firestore, "subjects"),
      orderBy("createdAt"),
    );
    const unsubscribeSubjects = onSnapshot(
      subjectsQuery,
      (snapshot) => {
        latestSubjects = snapshot.docs.map(subjectFromDoc);
        hasSubjects = true;
        publish();
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    const unsubscribePapers = onSnapshot(
      collection(firestore, "papers"),
      (snapshot) => {
        latestPapers = snapshot.docs.map(paperFromDoc);
        hasPapers = true;
        publish();
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return () => {
      unsubscribeSubjects();
      unsubscribePapers();
    };
  }, []);

  return { subjects, loading, error };
}
