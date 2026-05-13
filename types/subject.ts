import type { Timestamp } from "firebase/firestore";

export type FireDate = Timestamp | Date | string | null;

export type Subject = {
  id: string;
  name: string;
  icon: string;
  createdAt?: FireDate;
  paperCount?: number;
};
