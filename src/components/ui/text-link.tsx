import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Lien texte : soulignement bleu cadran qui s'étend de gauche à droite au survol. */
export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "relative text-cadran underline-offset-4",
        "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat",
        "transition-[background-size] duration-(--duree-moyenne) ease-maison hover:bg-[length:100%_1px]",
        className,
      )}
      {...props}
    />
  );
}
