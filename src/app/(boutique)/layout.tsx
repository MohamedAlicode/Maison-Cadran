import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { EtatFavorisProvider } from "@/components/favoris/etat-favoris";
import { EtatMiniPanierProvider } from "@/components/panier/etat-mini-panier";

/** Gabarit des pages publiques de la boutique. */
export default function LayoutBoutique({ children }: { children: React.ReactNode }) {
  return (
    <EtatMiniPanierProvider>
      <EtatFavorisProvider>
        <Header />
        {/* Au moins un écran de haut : le pied de page n'apparaît pas dans le premier écran
            pendant que la page arrive, puis ne saute pas vers le bas (décalage mesuré : 0,13 à 0,39). */}
        <main id="contenu" className="min-h-svh flex-1">
          {children}
        </main>
        <Footer />
      </EtatFavorisProvider>
    </EtatMiniPanierProvider>
  );
}
