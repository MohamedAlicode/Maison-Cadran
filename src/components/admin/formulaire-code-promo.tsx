"use client";

import { useActionState, useState } from "react";
import { Bloc, ChampSelect } from "@/components/admin/champs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import type { EtatFormulaireAdmin } from "@/lib/admin/regles";
import { enregistrerCodePromo } from "@/server/actions/admin-codes-promo";

export function FormulaireCodePromo({ code }: { code: Record<string, string> }) {
  const [etat, action, enCours] = useActionState<EtatFormulaireAdmin, FormData>(
    enregistrerCodePromo,
    null,
  );
  // Après une erreur, React vide le formulaire : on le remplit avec ce qui venait d'être saisi.
  const valeurs = etat?.valeurs ?? code;
  const [type, setType] = useState(valeurs.type);
  const champ = (nom: string) => ({
    id: `code-${nom}`,
    name: nom,
    defaultValue: valeurs[nom],
    erreur: etat?.erreurs?.[nom],
  });
  const caseACocher = (nom: string, libelle: string, aide: string) => (
    <div className="flex items-start gap-3">
      {/* Radix remet la case à son état initial quand React vide le formulaire : la clé la
          recrée avec la saisie renvoyée après une erreur. */}
      <Checkbox
        key={String(valeurs[nom])}
        id={`code-${nom}`}
        name={nom}
        defaultChecked={valeurs[nom] === "on"}
        aria-describedby={`code-${nom}-aide`}
        className="mt-0.5"
      />
      <div>
        <Label htmlFor={`code-${nom}`} className="mb-0">
          {libelle}
        </Label>
        <p id={`code-${nom}-aide`} className="text-sm text-graphite">
          {aide}
        </p>
      </div>
    </div>
  );

  return (
    <form action={action} className="grid gap-6">
      {code.id && <input type="hidden" name="id" value={code.id} />}
      <Bloc titre="Réduction">
        <Field
          {...champ("code")}
          label="Code"
          required
          className="uppercase"
          aide="Ce que le client saisit au panier, par exemple BIENVENUE10."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <ChampSelect
            {...champ("type")}
            label="Type"
            value={type}
            defaultValue={undefined}
            onChange={(e) => setType(e.target.value)}
            options={[
              { valeur: "PERCENT", libelle: "Pourcentage" },
              { valeur: "FIXED", libelle: "Montant fixe" },
            ]}
          />
          <Field
            {...champ("valeur")}
            label={type === "PERCENT" ? "Réduction (%)" : "Réduction (€)"}
            inputMode={type === "PERCENT" ? "numeric" : "decimal"}
            required
          />
        </div>
      </Bloc>

      <Bloc titre="Conditions">
        <div className="grid gap-6 sm:grid-cols-3">
          <Field
            {...champ("montantMinimum")}
            label="Achat minimum (€)"
            inputMode="decimal"
            aide="Vide : sans minimum."
          />
          <Field
            {...champ("utilisationsMax")}
            label="Utilisations au total"
            inputMode="numeric"
            aide="Vide : sans limite."
          />
          <Field
            {...champ("parClient")}
            label="Par client connecté"
            inputMode="numeric"
            aide="Vide : sans limite."
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field {...champ("debut")} type="date" label="Premier jour (facultatif)" />
          <Field {...champ("fin")} type="date" label="Dernier jour (facultatif)" />
        </div>
      </Bloc>

      <Bloc titre="Diffusion">
        {caseACocher("actif", "Actif", "Décoché, le code est refusé au panier.")}
        {caseACocher(
          "banderole",
          "Annoncer dans la banderole",
          "Le code défile en haut de toutes les pages pendant sa validité.",
        )}
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
