import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/firebase/config";

export const db = firebaseApp ? getFirestore(firebaseApp) : null;
