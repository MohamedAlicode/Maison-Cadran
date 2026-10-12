import { formatMm, type FicheProduit } from "@/lib/catalogue";
import {
  libelleCouleur,
  libellesBracelet,
  libellesGenre,
  libellesMatiere,
  libellesMouvement,
} from "@/lib/libelles";

type Ligne = [libelle: string, valeur: string | null | undefined];

/** Caractéristiques techniques regroupées par rubrique, comme sur les sites des fabricants. */
export function SpecsTable({ produit }: { produit: FicheProduit }) {
  const rubriques: { titre: string; lignes: Ligne[] }[] = [
    {
      titre: "Général",
      lignes: [
        ["Marque", produit.brand.name],
        ["Modèle", produit.name],
        ["Référence", produit.reference],
        ["Pour", libellesGenre[produit.gender]],
      ],
    },
    {
      titre: "Boîtier",
      lignes: [
        ["Diamètre", formatMm(produit.caseDiameterMm)],
        ["Épaisseur", produit.caseThicknessMm ? formatMm(produit.caseThicknessMm) : null],
        ["Matière", libellesMatiere[produit.caseMaterial]],
        ["Verre", produit.crystal],
        [
          "Étanchéité",
          `${produit.waterResistanceM} m (${(produit.waterResistanceM / 10).toLocaleString("fr-FR")} bar)`,
        ],
      ],
    },
    {
      titre: "Mouvement",
      lignes: [
        ["Type", libellesMouvement[produit.movement]],
        ["Calibre", produit.caliber],
        ["Réserve de marche", produit.powerReserveH ? `${produit.powerReserveH} heures` : null],
        ["Fonctions", produit.functions.join(", ")],
      ],
    },
    {
      titre: "Cadran et bracelet",
      lignes: [
        ["Couleur du cadran", libelleCouleur(produit.dialColor)],
        ["Bracelet", libellesBracelet[produit.strapType]],
        ["Couleur du bracelet", produit.strapColor ? libelleCouleur(produit.strapColor) : null],
        ["Largeur entre cornes", produit.lugWidthMm ? formatMm(produit.lugWidthMm) : null],
      ],
    },
  ];

  return (
    <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
      {rubriques.map((rubrique) => (
        <table key={rubrique.titre} className="w-full text-sm">
          <caption className="mb-3 text-left text-xs font-medium tracking-surtitre text-cadran uppercase">
            {rubrique.titre}
          </caption>
          <tbody>
            {rubrique.lignes
              .filter(([, valeur]) => valeur)
              .map(([libelle, valeur]) => (
                <tr key={libelle} className="border-b border-filet">
                  <th scope="row" className="w-1/2 py-3 pr-4 text-left font-normal text-graphite">
                    {libelle}
                  </th>
                  <td className="chiffres py-3 text-encre">{valeur}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
