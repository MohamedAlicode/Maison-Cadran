"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Panier } from "@/lib/panier/serveur";
import { appliquerCodePromo, retirerCodePromo } from "@/server/actions/panier";

/** Saisie du code promo, ou le code appliqué avec de quoi le retirer. */
export function CodePromo({ panier }: { panier: Pick<Panier, "codePromo" | "codeRefuse"> }) {
  const [etat, appliquer, enCours] = useActionState(appliquerCodePromo, null);
  const [retraitEnCours, demarrer] = useTransition();
  const garde = panier.codePromo ?? panier.codeRefuse;

  if (garde) {
    return (
      <div className="flex items-start justify-between gap-4 text-sm">
        <p role="status">
          Code <span className="chiffres font-medium">{garde.code}</span>{" "}
          {panier.codeRefuse ? (
            <span className="block text-bordeaux">{panier.codeRefuse.raison}</span>
          ) : (
            "appliqué"
          )}
        </p>
        {/* Même lien « Retirer » que sur les lignes du panier. */}
        <button
          type="button"
          className="-my-3 inline-flex h-11 shrink-0 items-center text-graphite underline decoration-filet-fort underline-offset-4 hover:text-encre"
          disabled={retraitEnCours}
          onClick={() => demarrer(() => retirerCodePromo())}
        >
          Retirer<span className="sr-only"> le code {garde.code}</span>
        </button>
      </div>
    );
  }

  const idErreur = etat?.message ? "code-promo-erreur" : undefined;
  return (
    <form action={appliquer}>
      <Label htmlFor="code-promo">Code promo</Label>
      <div className="flex gap-2">
        <Input
          id="code-promo"
          name="code"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={40}
          aria-invalid={idErreur ? true : undefined}
          aria-describedby={idErreur}
          className="uppercase"
        />
        <Button type="submit" variante="secondaire" disabled={enCours} className="shrink-0">
          Appliquer
        </Button>
      </div>
      <p id="code-promo-erreur" role="status" className="mt-2 text-sm text-bordeaux empty:hidden">
        {etat?.message}
      </p>
    </form>
  );
}
