import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Bouton de la charte : forme pilule, libellé en minuscules, le fond s'assombrit au survol.
const variantesBouton = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-full",
    "text-sm font-medium whitespace-nowrap",
    "transition-colors duration-(--duree-courte) ease-maison",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variante: {
        principal: "bg-cadran text-blanc hover:bg-cadran-fonce",
        secondaire: "border border-encre text-encre hover:bg-encre hover:text-acier",
        clair: "bg-acier text-encre hover:bg-blanc",
        fantome: "text-encre hover:bg-filet/40",
      },
      taille: {
        sm: "h-10 px-4",
        md: "h-12 px-6",
        lg: "h-14 px-8",
        icone: "size-11",
      },
      pleineLargeur: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variante: "principal",
      taille: "md",
    },
  },
);

type ProprietesBouton = ComponentProps<"button"> &
  VariantProps<typeof variantesBouton> & {
    /** Rend l'enfant (ex. un lien Next) avec le style du bouton. */
    asChild?: boolean;
  };

export function Button({
  className,
  variante,
  taille,
  pleineLargeur,
  asChild = false,
  children,
  ...props
}: ProprietesBouton) {
  const Composant = asChild ? Slot : "button";

  return (
    <Composant
      className={cn(variantesBouton({ variante, taille, pleineLargeur }), className)}
      {...props}
    >
      {children}
    </Composant>
  );
}

export { variantesBouton };
