import { cn } from "@/lib/utils";

/**
 * Editorial eyebrow label — a short accent line + uppercase text.
 * Replaces the repeated inline eyebrow markup across homepage sections.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-display text-[clamp(0.85rem,1.2vw,1.1rem)] uppercase tracking-wide text-accent-yellow",
        className
      )}
    >
      <span aria-hidden className="h-px w-7 bg-accent-yellow/60" />
      {children}
    </span>
  );
}
