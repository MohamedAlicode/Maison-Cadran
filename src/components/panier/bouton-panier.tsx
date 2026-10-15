import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { variantesBouton } from "@/components/ui/button";
import { lirePanier } from "@/lib/panier/serveur";
import { MiniPanier } from "./mini-panier";

async function MiniPanierAvecDonnees() {
  return <MiniPanier panier={await lirePanier()} />;
}

/**
 * Accès au panier dans l'en-tête. Le panier dépend du cookie du visiteur : il est lu à la
 * demande, et la page reste prérendue avec un simple lien vers /panier en attendant.
 */
export function BoutonPanier() {
  return (
    <Suspense
      fallback={
        <Link
          href="/panier"
          className={variantesBouton({ variante: "fantome", taille: "icone" })}
          aria-label="Panier"
        >
          <ShoppingBag className="size-5" strokeWidth={1.5} />
        </Link>
      }
    >
      <MiniPanierAvecDonnees />
    </Suspense>
  );
}
