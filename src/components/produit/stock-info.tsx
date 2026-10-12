import { Clock, PackageCheck } from "lucide-react";
import { boutique } from "@/config/boutique";
import { cn } from "@/lib/utils";

/** Disponibilité et délai de livraison, toujours visibles près du bouton d'achat. */
export function StockInfo({
  stock,
  delaiJours,
  seuilBas,
}: {
  stock: number;
  delaiJours: number;
  seuilBas: number;
}) {
  const etat =
    stock <= 0
      ? { texte: "Épuisée pour le moment", classe: "bg-graphite" }
      : stock <= seuilBas
        ? {
            texte:
              stock === 1 ? "Dernière pièce disponible" : `Plus que ${stock} pièces disponibles`,
            classe: "bg-ambre",
          }
        : { texte: "En stock", classe: "bg-sauge" };

  return (
    <ul className="space-y-2.5 text-sm">
      <li className="flex items-center gap-3">
        <span aria-hidden className={cn("size-2 rounded-full", etat.classe)} />
        <span
          className={cn(
            stock > 0 && stock <= seuilBas && "text-ambre",
            stock > seuilBas && "text-sauge",
          )}
        >
          {etat.texte}
        </span>
      </li>
      {stock > 0 && (
        <li className="flex items-center gap-3 text-graphite">
          <Clock aria-hidden className="size-4 text-cadran" strokeWidth={1.5} />
          Expédiée sous {delaiJours} jour{delaiJours > 1 ? "s" : ""} ouvré
          {delaiJours > 1 ? "s" : ""}, livrée en{" "}
          {boutique.livraison.delaiLivraison.replace(" après expédition", "")}
        </li>
      )}
      <li className="flex items-center gap-3 text-graphite">
        <PackageCheck aria-hidden className="size-4 text-cadran" strokeWidth={1.5} />
        {boutique.livraison.transporteur}, assurée
      </li>
    </ul>
  );
}
