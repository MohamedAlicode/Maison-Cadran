"use client";

import { useActionState } from "react";
import { Bloc, ChampTexte } from "@/components/admin/champs";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { EtatFormulaireAdmin } from "@/lib/admin/regles";

export type ChampSimple = {
  nom: string;
  label: string;
  aide?: string;
  zone?: boolean;
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
        {champs.map(({ nom, label, aide, zone, requis, numerique }) => {
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
            <ChampTexte key={nom} {...commun} rows={5} />
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
