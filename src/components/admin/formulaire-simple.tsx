"use client";

import { useActionState } from "react";
import { Bloc, ChampTexte } from "@/components/admin/champs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import type { EtatFormulaireAdmin } from "@/lib/admin/regles";

export type ChampSimple = {
  nom: string;
  label: string;
  aide?: string;
  zone?: boolean;
  /** Nombre de lignes d'une zone de texte (5 par défaut). */
  lignes?: number;
  caseACocher?: boolean;
  requis?: boolean;
  numerique?: boolean;
};

/** Formulaire d'une fiche courte (marque, collection) : une colonne, un bouton. */
export function FormulaireSimple({
  action: enregistrer,
  champs,
  valeurs: valeursInitiales,
  titre,
}: {
  action: (etat: EtatFormulaireAdmin, formulaire: FormData) => Promise<EtatFormulaireAdmin>;
  champs: ChampSimple[];
  valeurs: Record<string, string>;
  titre: string;
}) {
  const [etat, action, enCours] = useActionState(enregistrer, null);
  // Après une erreur, React vide le formulaire : on le remplit avec ce qui venait d'être saisi.
  const valeurs = etat?.valeurs ?? valeursInitiales;
  return (
    <form action={action} className="grid gap-6">
      {valeursInitiales.id && <input type="hidden" name="id" value={valeursInitiales.id} />}
      <Bloc titre={titre}>
        {champs.map(({ nom, label, aide, zone, lignes, caseACocher, requis, numerique }) => {
          if (caseACocher) {
            return (
              <div key={nom} className="flex items-start gap-3">
                {/* Recréée avec la saisie renvoyée : Radix revient sinon à son état initial. */}
                <Checkbox
                  key={String(valeurs[nom])}
                  id={`champ-${nom}`}
                  name={nom}
                  defaultChecked={valeurs[nom] === "on"}
                  aria-describedby={aide ? `champ-${nom}-aide` : undefined}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor={`champ-${nom}`} className="mb-0">
                    {label}
                  </Label>
                  {aide && (
                    <p id={`champ-${nom}-aide`} className="text-sm text-graphite">
                      {aide}
                    </p>
                  )}
                </div>
              </div>
            );
          }
          const commun = {
            id: `champ-${nom}`,
            name: nom,
            label,
            aide,
            required: requis,
            defaultValue: valeurs[nom],
            erreur: etat?.erreurs?.[nom],
          };
          return zone ? (
            <ChampTexte key={nom} {...commun} rows={lignes ?? 5} />
          ) : (
            <Field key={nom} {...commun} inputMode={numerique ? "numeric" : undefined} />
          );
        })}
      </Bloc>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={enCours}>
          {enCours ? "Enregistrement…" : "Enregistrer"}
        </Button>
        <p role="status" className="text-sm text-bordeaux empty:hidden">
          {etat?.message}
        </p>
      </div>
    </form>
  );
}
