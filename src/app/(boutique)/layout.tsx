import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { EtatMiniPanierProvider } from "@/components/panier/etat-mini-panier";

/** Gabarit des pages publiques de la boutique. */
export default function LayoutBoutique({ children }: { children: React.ReactNode }) {
  return (
    <EtatMiniPanierProvider>
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
    </EtatMiniPanierProvider>
  );
}
