"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { Bloc, ChampSelect, ChampTexte } from "@/components/admin/champs";
import { Button, variantesBouton } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import type { EtatFormulaireAdmin } from "@/lib/admin/regles";
import {
  libellesBracelet,
  libellesGenre,
  libellesMatiere,
  libellesMouvement,
  libellesStatutProduit,
} from "@/lib/libelles";
import { enregistrerProduit } from "@/server/actions/admin-produits";

export type ProduitEdite = Record<string, string> & { id?: string };
type Photo = { cle: number; url: string; alt: string };
type Option = { valeur: string; libelle: string };

const options = (libelles: Record<string, string>): Option[] =>
  Object.entries(libelles).map(([valeur, libelle]) => ({ valeur, libelle }));

const classeIcone = variantesBouton({ variante: "fantome", taille: "icone" });

export function FormulaireProduit({
  produit,
  photos: photosInitiales,
  collectionsCochees,
  marques,
  collections,
}: {
  produit: ProduitEdite;
  photos: { url: string; alt: string }[];
  collectionsCochees: string[];
  marques: Option[];
  collections: Option[];
}) {
  const [etat, action, enCours] = useActionState<EtatFormulaireAdmin, FormData>(
    enregistrerProduit,
    null,
  );
  const [photos, setPhotos] = useState<Photo[]>(() =>
    photosInitiales.map((p, cle) => ({ cle, ...p })),
  );
  const erreurs = etat?.erreurs ?? {};
  // Après une erreur, React vide le formulaire : on le remplit avec ce qui venait d'être saisi.
  const valeurs = etat?.valeurs ?? produit;
  const cochees = etat?.valeurs ? (etat.valeurs.collections ?? "").split(",") : collectionsCochees;
  const champ = (nom: string) => ({
    id: `produit-${nom}`,
    name: nom,
    defaultValue: valeurs[nom],
    erreur: erreurs[nom],
  });
  const modifierPhoto = (cle: number, modif: Partial<Photo>) =>
    setPhotos((liste) => liste.map((p) => (p.cle === cle ? { ...p, ...modif } : p)));

  function deplacer(i: number, sens: -1 | 1) {
    setPhotos((liste) => {
      const copie = [...liste];
      [copie[i], copie[i + sens]] = [copie[i + sens], copie[i]];
      return copie;
    });
  }

  return (
    <form action={action} className="grid gap-6">
      {produit.id && <input type="hidden" name="id" value={produit.id} />}

      <Bloc titre="Identité">
        <div className="grid gap-6 sm:grid-cols-2">
          <ChampSelect
            {...champ("marqueId")}
            label="Marque"
            options={[{ valeur: "", libelle: "Choisir…" }, ...marques]}
            required
          />
          <Field
            {...champ("nom")}
            label="Modèle"
            required
            aide="Sans la marque : « PRX Powermatic 80 »."
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field {...champ("reference")} label="Référence fabricant" required />
          <ChampSelect
            {...champ("statut")}
            label="Statut"
            options={options(libellesStatutProduit)}
          />
        </div>
        <Field
          {...champ("slug")}
          label="Adresse de la fiche"
          aide="Laissez vide pour la créer à partir de la marque, du modèle et du cadran."
        />
      </Bloc>

      <Bloc titre="Textes">
        <ChampTexte {...champ("resume")} label="Présentation courte" rows={2} required />
        <ChampTexte {...champ("description")} label="Description" rows={6} required />
        <ChampTexte {...champ("avisMaison")} label="L'avis de la maison (facultatif)" rows={3} />
      </Bloc>

      <Bloc titre="Prix et stock">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field {...champ("prix")} label="Prix TTC (€)" inputMode="decimal" required />
          <Field
            {...champ("prixBarre")}
            label="Prix barré (€, facultatif)"
            inputMode="decimal"
            aide="Ancien prix affiché barré à côté du prix."
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <Field {...champ("stock")} label="Stock" inputMode="numeric" required />
          <Field
            {...champ("seuilStockBas")}
            label="Alerte stock bas"
            inputMode="numeric"
            aide="Signalé au tableau de bord à ce niveau."
          />
          <Field
            {...champ("delaiExpeditionJours")}
            label="Expédiée sous (jours)"
            inputMode="numeric"
          />
          <Field {...champ("garantieMois")} label="Garantie (mois)" inputMode="numeric" />
        </div>
      </Bloc>

      <Bloc titre="Caractéristiques">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <ChampSelect {...champ("genre")} label="Genre" options={options(libellesGenre)} />
          <ChampSelect
            {...champ("mouvement")}
            label="Mouvement"
            options={options(libellesMouvement)}
          />
          <Field {...champ("calibre")} label="Calibre (facultatif)" />
          <Field
            {...champ("reserveMarcheH")}
            label="Réserve de marche (h, facultatif)"
            inputMode="numeric"
          />
          <Field {...champ("diametreMm")} label="Diamètre (mm)" inputMode="decimal" required />
          <Field {...champ("epaisseurMm")} label="Épaisseur (mm, facultatif)" inputMode="decimal" />
          <Field
            {...champ("entreCornesMm")}
            label="Entre-cornes (mm, facultatif)"
            inputMode="numeric"
          />
          <ChampSelect
            {...champ("matiereBoitier")}
            label="Boîtier"
            options={options(libellesMatiere)}
          />
          <ChampSelect
            {...champ("bracelet")}
            label="Bracelet"
            options={options(libellesBracelet)}
          />
          <Field {...champ("couleurBracelet")} label="Couleur du bracelet (facultatif)" />
          <Field
            {...champ("couleurCadran")}
            label="Couleur du cadran"
            required
            aide="Ex. bleu, noir, argenté."
          />
          <Field {...champ("etancheiteM")} label="Étanchéité (m)" inputMode="numeric" required />
          <Field {...champ("verre")} label="Verre (facultatif)" aide="Ex. saphir, minéral." />
        </div>
        <Field
          {...champ("fonctions")}
          label="Fonctions (facultatif)"
          aide="Séparées par des virgules : date, chronographe, GMT."
        />
      </Bloc>

      <Bloc titre="Photos">
        <p className="-mt-2 text-sm text-graphite">
          La première photo est celle des cartes du catalogue. Lien d&apos;un fichier du site
          (/images/…) ou de Cloudinary.
        </p>
        {erreurs.photos && <p className="text-sm text-bordeaux">{erreurs.photos}</p>}
        <ol className="grid gap-4">
          {photos.map((photo, i) => (
            <li
              key={photo.cle}
              className="grid gap-4 border-t border-filet pt-4 first:border-0 first:pt-0 md:grid-cols-[1fr_1fr_auto] md:items-start"
            >
              <Field
                id={`photo-${photo.cle}-url`}
                name={`photos.${i}.url`}
                label={`Photo ${i + 1} : lien`}
                value={photo.url}
                onChange={(e) => modifierPhoto(photo.cle, { url: e.target.value })}
                erreur={erreurs[`photos.${i}.url`]}
              />
              <Field
                id={`photo-${photo.cle}-alt`}
                name={`photos.${i}.alt`}
                label="Description"
                value={photo.alt}
                onChange={(e) => modifierPhoto(photo.cle, { alt: e.target.value })}
                erreur={erreurs[`photos.${i}.alt`]}
              />
              <div className="flex gap-1 md:mt-7">
                <button
                  type="button"
                  className={classeIcone}
                  onClick={() => deplacer(i, -1)}
                  disabled={i === 0}
                  aria-label={`Monter la photo ${i + 1}`}
                >
                  <ArrowUp aria-hidden className="size-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className={classeIcone}
                  onClick={() => deplacer(i, 1)}
                  disabled={i === photos.length - 1}
                  aria-label={`Descendre la photo ${i + 1}`}
                >
                  <ArrowDown aria-hidden className="size-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className={classeIcone}
                  onClick={() => setPhotos((liste) => liste.filter((p) => p.cle !== photo.cle))}
                  aria-label={`Retirer la photo ${i + 1}`}
                >
                  <Trash2 aria-hidden className="size-4" strokeWidth={1.5} />
                </button>
              </div>
            </li>
          ))}
        </ol>
        <Button
          type="button"
          variante="secondaire"
          taille="sm"
          className="justify-self-start"
          onClick={() =>
            setPhotos((liste) => [
              ...liste,
              { cle: Math.max(-1, ...liste.map((p) => p.cle)) + 1, url: "", alt: "" },
            ])
          }
        >
          <Plus aria-hidden className="size-4" strokeWidth={1.5} />
          Ajouter une photo
        </Button>
      </Bloc>

      <Bloc titre="Collections">
        {collections.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {collections.map((c) => (
              <li key={c.valeur} className="flex items-center gap-3">
                {/* Recréée après une erreur, sinon Radix revient à l'état initial de la case. */}
                <Checkbox
                  key={String(cochees.includes(c.valeur))}
                  id={`collection-${c.valeur}`}
                  name="collections"
                  value={c.valeur}
                  defaultChecked={cochees.includes(c.valeur)}
                />
                <Label htmlFor={`collection-${c.valeur}`} className="mb-0 font-normal">
                  {c.libelle}
                </Label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-graphite">Aucune collection pour le moment.</p>
        )}
      </Bloc>

      <Bloc titre="Référencement">
        <Field
          {...champ("titreSeo")}
          label="Titre pour Google (facultatif)"
          maxLength={70}
          aide="70 caractères au plus. Vide : marque et modèle."
        />
        <ChampTexte
          {...champ("descriptionSeo")}
          label="Description pour Google (facultatif)"
          rows={2}
          maxLength={160}
          aide="160 caractères au plus. Vide : la présentation courte."
        />
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
