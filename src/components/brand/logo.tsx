import Link from "next/link";
import { boutique } from "@/config/boutique";
import { cn } from "@/lib/utils";

/** Logotype provisoire : nom en serif, petit filet laiton. */
export function Logo({ className, clair = false }: { className?: string; clair?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex flex-col items-center leading-none", className)}
      aria-label={`${boutique.nom}, accueil`}
    >
      <span
        className={cn(
          "font-serif text-2xl font-medium tracking-[0.08em] uppercase md:text-[28px]",
          clair ? "text-creme" : "text-encre",
        )}
      >
        {boutique.nom}
      </span>
      <span aria-hidden className="mt-1.5 h-px w-8 bg-laiton" />
    </Link>
  );
}
