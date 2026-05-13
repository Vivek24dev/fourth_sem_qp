import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db } from "@/firebase/firestore";
import { storage } from "@/firebase/storage";
import type { Paper } from "@/types/paper";

export function paperFromDoc(
  document: QueryDocumentSnapshot<DocumentData>,
): Paper {
  const data = document.data();

  return {
    id: data.id ?? document.id,
    subjectId: data.subjectId ?? "",
    title: data.title ?? "Untitled paper",
    pdfUrl: data.pdfUrl ?? "",
    uploadedAt: data.uploadedAt ?? null,
    downloadCount: data.downloadCount ?? 0,
    storagePath: data.storagePath ?? undefined,
  };
}

export async function getPapers(subjectId?: string) {
  const firestore = db;

  if (!firestore) {
    return [];
  }

  const papersQuery = query(
    collection(firestore, "papers"),
    orderBy("uploadedAt", "desc"),
  );
  const snapshot = await getDocs(papersQuery);
  const papers = snapshot.docs.map(paperFromDoc);

  return subjectId
    ? papers.filter((paper) => paper.subjectId === subjectId)
    : papers;
}

export async function getPaperById(id: string) {
  const firestore = db;

  if (!firestore) {
    return null;
  }

  const paperSnapshot = await getDoc(doc(firestore, "papers", id));

  if (!paperSnapshot.exists()) {
    return null;
  }

  const data = paperSnapshot.data();

  return {
    id: data.id ?? paperSnapshot.id,
    subjectId: data.subjectId ?? "",
    title: data.title ?? "Untitled paper",
    pdfUrl: data.pdfUrl ?? "",
    uploadedAt: data.uploadedAt ?? null,
    downloadCount: data.downloadCount ?? 0,
    storagePath: data.storagePath ?? undefined,
  } satisfies Paper;
}

export async function updatePaperTitle(id: string, title: string) {
  const firestore = db;

  if (!firestore) {
    throw new Error("Add Firebase environment variables before editing papers.");
  }

  const cleanTitle = title.trim();

  if (!cleanTitle) {
    throw new Error("Paper title is required.");
  }

  await updateDoc(doc(firestore, "papers", id), {
    title: cleanTitle,
  });
}

export async function deletePaper(paper: Paper) {
  const firestore = db;

  if (!firestore) {
    throw new Error("Add Firebase environment variables before deleting papers.");
  }

  if (storage && paper.storagePath) {
    try {
      await deleteObject(ref(storage, paper.storagePath));
    } catch {
      // The Firestore record should still be removable if the storage file is gone.
    }
  }

  await deleteDoc(doc(firestore, "papers", paper.id));
}
