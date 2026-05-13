import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firestore";
import type { Subject } from "@/types/subject";

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "ada",
    name: "ADA",
    icon: "/icons/ada.png",
    createdAt: null,
    paperCount: 0,
  },
  {
    id: "mc",
    name: "MC",
    icon: "/icons/mc.png",
    createdAt: null,
    paperCount: 0,
  },
  {
    id: "dbms",
    name: "DBMS",
    icon: "/icons/dbms.png",
    createdAt: null,
    paperCount: 0,
  },
  {
    id: "gt",
    name: "GT",
    icon: "/icons/gt.png",
    createdAt: null,
    paperCount: 0,
  },
  {
    id: "biology",
    name: "Biology",
    icon: "/icons/biology.png",
    createdAt: null,
    paperCount: 0,
  },
  {
    id: "uhv",
    name: "UHV",
    icon: "/icons/uhv.png",
    createdAt: null,
    paperCount: 0,
  },
];

export function subjectFromDoc(
  document: QueryDocumentSnapshot<DocumentData>,
): Subject {
  const data = document.data();

  return {
    id: data.id ?? document.id,
    name: data.name ?? document.id,
    icon: data.icon ?? "",
    createdAt: data.createdAt ?? null,
    paperCount: 0,
  };
}

export async function getSubjects() {
  const firestore = db;

  if (!firestore) {
    return DEFAULT_SUBJECTS;
  }

  const subjectsQuery = query(
    collection(firestore, "subjects"),
    orderBy("createdAt"),
  );
  const snapshot = await getDocs(subjectsQuery);

  return snapshot.docs.map(subjectFromDoc);
}

export async function getSubjectsWithCounts() {
  const subjects = await getSubjects();
  const firestore = db;

  if (!firestore) {
    return subjects;
  }

  const paperSnapshot = await getDocs(collection(firestore, "papers"));
  const counts = new Map<string, number>();

  paperSnapshot.docs.forEach((paperDoc) => {
    const subjectId = paperDoc.data().subjectId as string | undefined;

    if (subjectId) {
      counts.set(subjectId, (counts.get(subjectId) ?? 0) + 1);
    }
  });

  return subjects.map((subject) => ({
    ...subject,
    paperCount: counts.get(subject.id) ?? 0,
  }));
}

export async function getSubjectById(id: string) {
  const firestore = db;

  if (!firestore) {
    return DEFAULT_SUBJECTS.find((subject) => subject.id === id) ?? null;
  }

  const subjectSnapshot = await getDoc(doc(firestore, "subjects", id));

  if (!subjectSnapshot.exists()) {
    return null;
  }

  const data = subjectSnapshot.data();

  return {
    id: data.id ?? subjectSnapshot.id,
    name: data.name ?? subjectSnapshot.id,
    icon: data.icon ?? "",
    createdAt: data.createdAt ?? null,
    paperCount: 0,
  } satisfies Subject;
}

export async function addSubject({
  name,
  icon,
}: {
  name: string;
  icon: string;
}) {
  const firestore = db;

  if (!firestore) {
    throw new Error("Add Firebase environment variables before saving subjects.");
  }

  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("Subject name is required.");
  }

  const subjectId = slugify(cleanName);
  const subjectRef = doc(firestore, "subjects", subjectId);
  const existingSubject = await getDoc(subjectRef);

  if (existingSubject.exists()) {
    throw new Error("A subject with this name already exists.");
  }

  const subject = {
    id: subjectId,
    name: cleanName,
    icon: icon.trim() || `/icons/${subjectId}.png`,
    createdAt: serverTimestamp(),
  };

  await setDoc(subjectRef, subject);

  return {
    ...subject,
    createdAt: new Date(),
    paperCount: 0,
  } satisfies Subject;
}

export async function deleteSubject(id: string) {
  const firestore = db;

  if (!firestore) {
    throw new Error("Add Firebase environment variables before deleting subjects.");
  }

  const batch = writeBatch(firestore);
  const papersQuery = query(
    collection(firestore, "papers"),
    where("subjectId", "==", id),
  );
  const papersSnapshot = await getDocs(papersQuery);

  papersSnapshot.docs.forEach((paperDoc) => {
    batch.delete(paperDoc.ref);
  });

  batch.delete(doc(firestore, "subjects", id));
  await batch.commit();
}

export async function seedDefaultSubjects() {
  const firestore = db;

  if (!firestore) {
    throw new Error("Add Firebase environment variables before seeding subjects.");
  }

  const batch = writeBatch(firestore);

  DEFAULT_SUBJECTS.forEach((subject) => {
    const subjectRef = doc(firestore, "subjects", subject.id);
    batch.set(
      subjectRef,
      {
        id: subject.id,
        name: subject.name,
        icon: subject.icon,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  await batch.commit();
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
