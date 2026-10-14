import { formatMm, type FicheProduit } from "@/lib/catalogue";
import {
  libelleCouleur,
  libellesBracelet,
  libellesGenre,
  libellesMatiere,
  libellesMouvement,
} from "@/lib/libelles";

type Ligne = [libelle: string, valeur: string | null | undefined, aide?: string];

// Une phrase pour un premier acheteur, sous les caractéristiques qui demandent à être lues.
const aideMouvement: Record<string, string> = {
  AUTOMATIQUE: "Se remonte en la portant, sans pile.",
  MANUEL: "Se remonte à la main par la couronne.",
  QUARTZ: "À pile, la plus précise.",
  SOLAIRE: "Quartz rechargé par la lumière, sans pile à changer.",
  KINETIQUE: "Quartz rechargé par les mouvements du poignet.",
};

function aideEtancheite(metres: number) {
  if (metres <= 50) return "Pluie et éclaboussures, pas de baignade.";
  if (metres < 200) return "Baignade et natation.";
  return "Plongée de loisir et sports nautiques.";
}

function aideVerre(verre: string) {
  return /saphir/i.test(verre)
    ? "Presque impossible à rayer au quotidien."
    : "Plus souple aux chocs, mais se raye plus facilement.";
}

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
        ["Verre", produit.crystal, produit.crystal ? aideVerre(produit.crystal) : undefined],
        [
          "Étanchéité",
          `${produit.waterResistanceM} m (${(produit.waterResistanceM / 10).toLocaleString("fr-FR")} bar)`,
          aideEtancheite(produit.waterResistanceM),
        ],
      ],
    },
    {
      titre: "Mouvement",
      lignes: [
        ["Type", libellesMouvement[produit.movement], aideMouvement[produit.movement]],
        ["Calibre", produit.caliber],
        [
          "Réserve de marche",
          produit.powerReserveH ? `${produit.powerReserveH} heures` : null,
          "Durée de marche une fois la montre retirée.",
        ],
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
          <caption className="mb-3 text-left font-serif text-xl">{rubrique.titre}</caption>
          <tbody>
            {rubrique.lignes
              .filter(([, valeur]) => valeur)
              .map(([libelle, valeur, aide]) => (
                <tr key={libelle} className="border-b border-filet">
                  <th scope="row" className="w-1/2 py-3 pr-4 text-left font-normal text-graphite">
                    {libelle}
                  </th>
                  <td className="chiffres py-3 text-encre">
                    {valeur}
                    {aide && <span className="mt-0.5 block text-xs text-graphite">{aide}</span>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
