"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { variantesBouton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Tiroir latéral (mini-panier, filtres mobiles, menu). Basé sur Dialog de Radix :
// piège du focus, fermeture par Échap et retour du focus sont gérés.
export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

type Proprietes = ComponentProps<typeof DialogPrimitive.Content> & {
  titre: string;
  description?: string;
  pied?: ReactNode;
  cote?: "droite" | "gauche";
};

export function DrawerContent({
  titre,
  description,
  pied,
  cote = "droite",
  className,
  children,
  ...props
}: Proprietes) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-nuit/40 data-[state=open]:animate-fondu" />
      <DialogPrimitive.Content
        className={cn(
          // Verre : la page reste devinée derrière le tiroir. 90 % d'acier garde le texte graphite
          // au-dessus de 4,5:1 même devant le pied de page sombre.
          "fixed inset-y-0 z-50 flex w-full max-w-md flex-col bg-acier/90 shadow-tiroir backdrop-blur-verre transparence-reduite:bg-acier",
          cote === "droite"
            ? "right-0 data-[state=open]:animate-glisse-droite"
            : "left-0 data-[state=open]:animate-glisse-gauche",
          className,
        )}
        // Sans description, Radix en attend une : on le signale plutôt que de répéter le titre.
        {...(!description && { "aria-describedby": undefined })}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-filet px-6 py-5">
          <DialogPrimitive.Title className="font-serif text-2xl">{titre}</DialogPrimitive.Title>
          <DialogPrimitive.Close
            className={variantesBouton({ variante: "fantome", taille: "icone" })}
            aria-label="Fermer"
          >
            <X className="size-5" strokeWidth={1.5} />
          </DialogPrimitive.Close>
        </div>
        {description && (
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {pied && <div className="border-t border-filet px-6 py-5">{pied}</div>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
