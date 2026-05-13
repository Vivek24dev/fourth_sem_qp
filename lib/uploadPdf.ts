import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db } from "@/firebase/firestore";
import { storage } from "@/firebase/storage";
import type { Paper } from "@/types/paper";

type UploadPdfInput = {
  subjectId: string;
  title: string;
  file: File;
};

type AddPdfLinkInput = {
  subjectId: string;
  title: string;
  pdfUrl: string;
};

export async function uploadPdf({ subjectId, title, file }: UploadPdfInput) {
  const firestore = db;
  const bucket = storage;

  if (!firestore || !bucket) {
    throw new Error("Add Firebase environment variables before uploading PDFs.");
  }

  if (!subjectId) {
    throw new Error("Select a subject first.");
  }

  if (!title.trim()) {
    throw new Error("Paper title is required.");
  }

  if (file.type && file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }

  const paperRef = doc(collection(firestore, "papers"));
  const storagePath = `papers/${subjectId}/${Date.now()}-${safeFileName(file.name)}`;
  const fileRef = ref(bucket, storagePath);

  await uploadBytes(fileRef, file, {
    contentType: "application/pdf",
  });

  const pdfUrl = await getDownloadURL(fileRef);
  const paper = {
    id: paperRef.id,
    subjectId,
    title: title.trim(),
    pdfUrl,
    uploadedAt: serverTimestamp(),
    downloadCount: 0,
    storagePath,
  };

  await setDoc(paperRef, paper);

  return {
    ...paper,
    uploadedAt: new Date(),
  } satisfies Paper;
}

export async function addPdfLink({
  subjectId,
  title,
  pdfUrl,
}: AddPdfLinkInput) {
  const firestore = db;

  if (!firestore) {
    throw new Error("Add Firebase environment variables before saving papers.");
  }

  if (!subjectId) {
    throw new Error("Select a subject first.");
  }

  if (!title.trim()) {
    throw new Error("Paper title is required.");
  }

  const normalizedUrl = normalizePdfUrl(pdfUrl);
  const paperRef = doc(collection(firestore, "papers"));
  const paper = {
    id: paperRef.id,
    subjectId,
    title: title.trim(),
    pdfUrl: normalizedUrl,
    uploadedAt: serverTimestamp(),
    downloadCount: 0,
  };

  await setDoc(paperRef, paper);

  return {
    ...paper,
    uploadedAt: new Date(),
  } satisfies Paper;
}

function safeFileName(fileName: string) {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizePdfUrl(value: string) {
  const cleanUrl = value.trim();

  if (!cleanUrl) {
    throw new Error("PDF link is required.");
  }

  let url: URL;

  try {
    url = new URL(cleanUrl);
  } catch {
    throw new Error("Enter a valid PDF link.");
  }

  const driveFileMatch = url.href.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  const driveOpenId = url.hostname === "drive.google.com" ? url.searchParams.get("id") : null;
  const driveId = driveFileMatch?.[1] ?? driveOpenId;

  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }

  return url.href;
}
