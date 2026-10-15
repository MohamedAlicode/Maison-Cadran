import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge ne lit pas globals.css : on lui déclare les tokens maison qui ne sont pas des couleurs.
// Sans cela, « text-libelle » (une taille) serait pris pour une couleur et supprimé face à « text-blanc ».
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["libelle"],
      leading: ["affiche", "titre"],
      tracking: ["titre", "logo", "surtitre"],
      shadow: ["tiroir"],
      radius: ["controle", "cadre"],
      blur: ["verre"],
      ease: ["maison"],
    },
  },
});

/** Fusionne des classes Tailwind en résolvant les conflits (ex. « px-2 » puis « px-4 »). */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
