"use client";

import { Check, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reglesMotDePasse } from "@/lib/compte/regles";
import { cn } from "@/lib/utils";

/**
 * Mot de passe avec un bouton pour l'afficher. À l'inscription, les règles sont listées sous
 * le champ et se cochent pendant la saisie : on voit ce qui manque avant d'envoyer.
 */
export function ChampMotDePasse({
  id,
  nouveau,
  erreur,
}: {
  id: string;
  nouveau: boolean;
  erreur?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [valeur, setValeur] = useState("");
  const idRegles = nouveau ? `${id}-regles` : undefined;
  const idErreur = erreur ? `${id}-erreur` : undefined;

  return (
    <div>
      <Label htmlFor={id}>Mot de passe</Label>
      <div className="relative">
        <Input
          id={id}
          name="motDePasse"
          type={visible ? "text" : "password"}
          autoComplete={nouveau ? "new-password" : "current-password"}
          required
          maxLength={128}
          value={valeur}
          onChange={(evenement) => setValeur(evenement.target.value)}
          aria-invalid={erreur ? true : undefined}
          aria-describedby={[idRegles, idErreur].filter(Boolean).join(" ") || undefined}
          className="pr-14"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-controls={id}
          aria-label="Afficher le mot de passe"
          className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center rounded-r-controle text-graphite transition-colors duration-(--duree-courte) hover:text-encre focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cadran"
        >
          {visible ? (
            <EyeOff aria-hidden className="size-5" strokeWidth={1.5} />
          ) : (
            <Eye aria-hidden className="size-5" strokeWidth={1.5} />
          )}
        </button>
      </div>
      {nouveau && (
        <ul id={idRegles} className="mt-3 grid gap-1.5 text-sm">
          {reglesMotDePasse.map(({ libelle, respectee }) => {
            const ok = respectee(valeur);
            return (
              <li
                key={libelle}
                className={cn("flex items-center gap-2", ok ? "text-encre" : "text-graphite")}
              >
                {ok ? (
                  <Check aria-hidden className="size-4 text-cadran" strokeWidth={2} />
                ) : (
                  <X aria-hidden className="size-4" strokeWidth={1.5} />
                )}
                {libelle}
                <span className="sr-only">{ok ? " : respecté" : " : pas encore"}</span>
              </li>
            );
          })}
        </ul>
      )}
      {erreur && (
        <p id={idErreur} className="mt-2 text-sm text-bordeaux">
          {erreur}
        </p>
      )}
    </div>
  );
}
