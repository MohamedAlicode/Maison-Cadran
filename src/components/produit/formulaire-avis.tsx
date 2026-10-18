"use client";

import { Star } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { classeSaisie } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { deposerAvis } from "@/server/actions/avis";

/**
 * Dépôt d'un avis sur la fiche produit.
 * Les étoiles sont des boutons radio : le CSS seul remplit l'étoile choisie et celles qui la
 * précèdent (toutes dès qu'une note est cochée, puis on vide celles qui suivent la cochée).
 */
export function FormulaireAvis({ produitId }: { produitId: string }) {
  const [etat, action, enCours] = useActionState(deposerAvis, null);

  if (etat?.ok) {
    return (
      <p role="status" className="font-serif text-2xl">
        Merci, votre avis est publié.
      </p>
    );
  }

  const valeurs = etat?.valeurs ?? {};
  const erreurs = etat?.erreurs ?? {};

  return (
    <form action={action} className="grid max-w-2xl gap-6">
      <input type="hidden" name="produitId" value={produitId} />

      <fieldset aria-describedby={erreurs.note ? "avis-note-erreur" : undefined}>
        <legend className="mb-2 text-sm font-medium text-encre">Votre note</legend>
        <div className="group -ml-2 flex">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className={cn(
                "peer grid size-11 cursor-pointer place-items-center rounded-full text-filet-fort",
                "group-has-checked:text-cadran group-has-checked:[&_svg]:fill-cadran",
                "peer-has-checked:text-filet-fort peer-has-checked:[&_svg]:fill-none",
                "has-focus-visible:outline-2 has-focus-visible:outline-cadran",
              )}
            >
              <input
                type="radio"
                name="note"
                value={n}
                required
                defaultChecked={valeurs.note === String(n)}
                className="sr-only"
              />
              <Star aria-hidden className="size-7" strokeWidth={1.25} />
              <span className="sr-only">{n} sur 5</span>
            </label>
          ))}
        </div>
        {erreurs.note && (
          <p id="avis-note-erreur" className="mt-2 text-sm text-bordeaux">
            {erreurs.note}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="avis-prenom"
          name="prenom"
          label="Prénom"
          autoComplete="given-name"
          required
          minLength={2}
          maxLength={40}
          defaultValue={valeurs.prenom}
          aide="Affiché avec votre avis."
          erreur={erreurs.prenom}
        />
        <Field
          id="avis-email"
          name="email"
          type="email"
          label="E-mail"
          autoComplete="email"
          required
          defaultValue={valeurs.email}
          aide="Jamais publié. Un seul avis par montre."
          erreur={erreurs.email}
        />
      </div>

      <Field
        id="avis-titre"
        name="titre"
        label="Titre (facultatif)"
        maxLength={80}
        defaultValue={valeurs.titre}
      />

      <div>
        <Label htmlFor="avis-texte">Votre avis</Label>
        <textarea
          id="avis-texte"
          name="texte"
          rows={5}
          required
          minLength={20}
          maxLength={2000}
          defaultValue={valeurs.texte}
          aria-invalid={erreurs.texte ? true : undefined}
          aria-describedby={erreurs.texte ? "avis-texte-erreur" : undefined}
          className={cn(classeSaisie, "h-auto py-3 leading-relaxed")}
        />
        {erreurs.texte && (
          <p id="avis-texte-erreur" className="mt-2 text-sm text-bordeaux">
            {erreurs.texte}
          </p>
        )}
      </div>

      <div>
        {/* Même choix que « Commander » : aria-disabled garde le focus sur le bouton. */}
        <Button
          type="submit"
          aria-disabled={enCours}
          onClick={(evenement) => enCours && evenement.preventDefault()}
        >
          {enCours ? "Publication…" : "Publier mon avis"}
        </Button>
        <p role="status" className="mt-3 text-sm text-bordeaux empty:hidden">
          {etat?.message}
        </p>
      </div>
    </form>
  );
}
