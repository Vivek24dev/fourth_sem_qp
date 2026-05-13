import { Inbox } from "lucide-react";
import GlassCard from "@/components/GlassCard";

type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <GlassCard className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
      <Inbox className="mb-3 h-8 w-8 text-teal-200" aria-hidden="true" />
      <h3 className="text-base font-semibold text-stone-50">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-stone-300">
        {description}
      </p>
    </GlassCard>
  );
}
