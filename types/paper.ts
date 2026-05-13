import type { FireDate } from "@/types/subject";

export type Paper = {
  id: string;
  subjectId: string;
  title: string;
  pdfUrl: string;
  uploadedAt?: FireDate;
  downloadCount: number;
  storagePath?: string;
};
