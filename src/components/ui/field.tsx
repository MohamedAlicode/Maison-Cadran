import type { ComponentProps } from "react";
import { Input } from "./input";
import { Label } from "./label";

type Proprietes = ComponentProps<typeof Input> & {
  id: string;
  label: string;
  aide?: string;
  erreur?: string;
};

/** Champ complet : libellé, saisie, aide et message d'erreur reliés pour les lecteurs d'écran. */
export function Field({ id, label, aide, erreur, ...props }: Proprietes) {
  const idAide = aide ? `${id}-aide` : undefined;
  const idErreur = erreur ? `${id}-erreur` : undefined;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={[idAide, idErreur].filter(Boolean).join(" ") || undefined}
        {...props}
      />
      {aide && !erreur && (
        <p id={idAide} className="mt-2 text-sm text-graphite">
          {aide}
        </p>
      )}
      {erreur && (
        <p id={idErreur} className="mt-2 text-sm text-bordeaux">
          {erreur}
        </p>
      )}
    </div>
  );
}
