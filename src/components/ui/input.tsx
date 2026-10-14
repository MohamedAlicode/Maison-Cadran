import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Champ de saisie : fond ivoire, bordure sable, focus encre + anneau laiton. */
export function Input({ className, "aria-invalid": invalide, ...props }: ComponentProps<"input">) {
  return (
    <input
      aria-invalid={invalide}
      className={cn(
        "h-12 w-full rounded-xs border border-sable bg-ivoire px-4 text-[15px] text-encre",
        "transition-colors duration-150 placeholder:text-graphite/70",
        "focus-visible:border-encre focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-laiton",
        "aria-invalid:border-bordeaux",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
