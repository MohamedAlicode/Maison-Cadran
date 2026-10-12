import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Bouton de la charte : capitales espacées, coins quasi droits, filet laiton au survol.
const variantesBouton = cva(
  [
    "group/bouton relative inline-flex items-center justify-center gap-2 rounded-xs",
    "text-[13px] font-medium tracking-surtitre uppercase whitespace-nowrap",
    "transition-colors duration-200 ease-maison",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variante: {
        principal: "bg-encre text-creme hover:bg-nuit",
        secondaire: "border border-encre text-encre hover:bg-encre hover:text-creme",
        clair: "bg-creme text-encre hover:bg-ivoire",
        fantome: "text-encre hover:bg-sable/40",
      },
      taille: {
        sm: "h-10 px-4",
        md: "h-12 px-7",
        lg: "h-14 px-9",
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
  const avecFilet = variante === "principal" || variante === undefined || variante === null;

  return (
    <Composant
      className={cn(variantesBouton({ variante, taille, pleineLargeur }), className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {children}
          {avecFilet && (
            <span
              aria-hidden
              className="absolute inset-x-7 bottom-3 h-px origin-left scale-x-0 bg-laiton-clair transition-transform duration-300 ease-maison group-hover/bouton:scale-x-100"
            />
          )}
        </>
      )}
    </Composant>
  );
}

export { variantesBouton };
