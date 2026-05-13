import { getStorage } from "firebase/storage";
import { firebaseApp } from "@/firebase/config";

export const storage = firebaseApp ? getStorage(firebaseApp) : null;
