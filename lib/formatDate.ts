import type { FireDate } from "@/types/subject";

export function formatDate(value?: FireDate) {
  if (!value) {
    return "No date";
  }

  const date =
    typeof value === "string"
      ? new Date(value)
      : value instanceof Date
        ? value
        : value.toDate();

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
