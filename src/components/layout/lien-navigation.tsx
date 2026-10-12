"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Lien du menu principal qui signale la page en cours (aria-current et filet bleu cadran).
 * Seul le chemin est comparé : « Homme » et « Femme » filtrent /montres et ne sont pas des pages à part.
 */
export function LienNavigation({
  href,
  className,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const chemin = usePathname();
  const actif = !href.includes("?") && chemin === href;
  return (
    <Link
      href={href}
      aria-current={actif ? "page" : undefined}
      className={cn(
        "underline-offset-8 transition-colors hover:text-cadran",
        actif && "text-cadran underline decoration-1",
        className,
      )}
      {...props}
    />
  );
}
