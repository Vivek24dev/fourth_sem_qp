import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firestore";

export async function trackDownload(paperId: string) {
  const firestore = db;

  if (!firestore) {
    return;
  }

  await updateDoc(doc(firestore, "papers", paperId), {
    downloadCount: increment(1),
  });
}
