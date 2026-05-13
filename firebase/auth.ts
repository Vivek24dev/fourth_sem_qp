import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "@/firebase/config";

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();
