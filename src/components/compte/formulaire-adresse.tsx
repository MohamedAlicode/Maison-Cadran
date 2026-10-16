"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { enregistrerAdresse } from "@/server/actions/compte";

export type AdresseSaisie = {
  id: string;
  libelle: string;
  prenom: string;
  nom: string;
  societe: string;
  ligne1: string;
  ligne2: string;
  codePostal: string;
  ville: string;
  telephone: string;
  parDefaut: boolean;
};

/** Ajout ou modification d'une adresse ; une fois enregistrée, on revient à la liste. */
export function FormulaireAdresse({ adresse }: { adresse?: AdresseSaisie }) {
  const [etat, action, enCours] = useActionState(enregistrerAdresse, null);
  const routeur = useRouter();

  useEffect(() => {
    if (etat?.ok) routeur.replace("/compte/adresses", { scroll: false });
  }, [etat, routeur]);

  const valeurs: Partial<Record<keyof AdresseSaisie, string>> =
    etat && !etat.ok ? etat.valeurs : { ...adresse, parDefaut: undefined };
  const erreurs = (etat && !etat.ok && etat.erreurs) || {};
  const champ = (nom: keyof AdresseSaisie) => ({
    id: `adresse-${nom}`,
    name: nom,
    defaultValue: valeurs[nom],
    erreur: erreurs[nom as keyof typeof erreurs],
  });

  return (
    <form action={action} className="grid gap-6">
      {adresse && <input type="hidden" name="id" value={adresse.id} />}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field {...champ("prenom")} label="Prénom" autoComplete="given-name" required />
        <Field {...champ("nom")} label="Nom" autoComplete="family-name" required />
      </div>
      <Field {...champ("societe")} label="Société (facultatif)" autoComplete="organization" />
      <Field {...champ("ligne1")} label="Adresse" autoComplete="address-line1" required />
      <Field
        {...champ("ligne2")}
        label="Complément (facultatif)"
        autoComplete="address-line2"
        aide="Bâtiment, étage, digicode."
      />
      <div className="grid gap-6 sm:grid-cols-[10rem_1fr]">
        <Field
          {...champ("codePostal")}
          label="Code postal"
          autoComplete="postal-code"
          inputMode="numeric"
          required
          maxLength={5}
        />
        <Field {...champ("ville")} label="Ville" autoComplete="address-level2" required />
      </div>
      <Field
        {...champ("telephone")}
        type="tel"
        label="Téléphone"
        autoComplete="tel"
        required
        aide="Le livreur vous appelle si besoin : la montre est remise contre signature."
      />
      <Field
        {...champ("libelle")}
        label="Nom de l'adresse (facultatif)"
        placeholder="Maison, bureau…"
      />
      <div className="flex items-center gap-3">
        <Checkbox
          id="adresse-parDefaut"
          name="parDefaut"
          value="on"
          defaultChecked={adresse?.parDefaut || valeurs.parDefaut === "on"}
        />
        <Label htmlFor="adresse-parDefaut" className="mb-0">
          Adresse par défaut
        </Label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          aria-disabled={enCours}
          onClick={(evenement) => enCours && evenement.preventDefault()}
        >
          {enCours ? "Enregistrement…" : "Enregistrer l'adresse"}
        </Button>
        <Button asChild variante="fantome">
          <Link href="/compte/adresses" scroll={false}>
            Annuler
          </Link>
        </Button>
      </div>
      <p role="status" className="text-sm text-bordeaux empty:hidden">
        {etat && !etat.ok ? etat.message : null}
      </p>
    </form>
  );
}
