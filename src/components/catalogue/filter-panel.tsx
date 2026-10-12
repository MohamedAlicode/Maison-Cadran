"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { versQueryString, type CleFiltre, type Facette, type Filtres } from "@/lib/filtres";
import { useNavigationCatalogue } from "./navigation-catalogue";

type Proprietes = {
  facettes: Facette[];
  filtres: Filtres;
  /** Chemin de la page (ex. /montres, /marques/tissot). */
  chemin: string;
  /** Préfixe des identifiants, pour avoir deux panneaux sur la même page (desktop et mobile). */
  idPrefixe: string;
};

/** Panneau de filtres à facettes : accordéons, cases à cocher et compteurs. */
export function FilterPanel({ facettes, filtres, chemin, idPrefixe }: Proprietes) {
  const { naviguer } = useNavigationCatalogue();

  function basculer(cle: CleFiltre, valeur: string) {
    const actuelles = filtres[cle];
    const nouvelles = actuelles.includes(valeur)
      ? actuelles.filter((v) => v !== valeur)
      : [...actuelles, valeur];
    // Changer un filtre ramène toujours à la première page.
    naviguer(chemin + versQueryString({ ...filtres, [cle]: nouvelles, page: 1 }));
  }

  const visibles = facettes.filter((f) => f.options.length > 0);
  const ouvertes = visibles
    // Le mouvement compte parmi les premiers critères d'un débutant : ouvert comme les trois premiers.
    .filter((f, i) => i < 3 || f.cle === "mouvement" || f.options.some((o) => o.actif))
    .map((f) => f.cle);

  return (
    <Accordion
      type="multiple"
      defaultValue={ouvertes}
      // Dans le tiroir, l'en-tête porte déjà un filet : pas de second trait juste en dessous.
      className={idPrefixe === "mobile" ? undefined : "border-t border-filet"}
    >
      {visibles.map((facette) => (
        <AccordionItem key={facette.cle} value={facette.cle}>
          <AccordionTrigger>
            <span>
              {facette.titre}
              {filtres[facette.cle].length > 0 && (
                <span className="chiffres ml-2 text-cadran">({filtres[facette.cle].length})</span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <fieldset>
              <legend className="sr-only">{facette.titre}</legend>
              <ul>
                {facette.options.map((option) => {
                  const id = `${idPrefixe}-${facette.cle}-${option.valeur}`;
                  return (
                    <li key={option.valeur} className="flex items-center gap-3">
                      <Checkbox
                        id={id}
                        checked={option.actif}
                        onCheckedChange={() => basculer(facette.cle, option.valeur)}
                      />
                      <Label
                        htmlFor={id}
                        className="mb-0 flex-1 cursor-pointer py-3 font-normal text-encre"
                      >
                        {option.libelle}
                      </Label>
                      <span className="chiffres text-xs text-cadran">{option.compte}</span>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
