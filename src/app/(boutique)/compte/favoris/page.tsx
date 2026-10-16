import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GrilleProduits } from "@/components/catalogue/product-card";
import { Button } from "@/components/ui/button";
import { indexCatalogue } from "@/lib/catalogue";
import { exigerClient, idsFavoris } from "@/lib/compte/serveur";

export const metadata: Metadata = { title: "Mes favoris" };

async function Favoris() {
  const client = await exigerClient("/compte/favoris");
  const [ids, catalogue] = await Promise.all([idsFavoris(client.id), indexCatalogue()]);
  // Ordre des favoris (le plus récent d'abord) ; une montre retirée du catalogue disparaît.
  const parId = new Map(catalogue.map((p) => [p.id, p]));
  const produits = ids.flatMap((id) => parId.get(id) ?? []);

  if (produits.length === 0) {
    return (
      <div className="rounded-cadre bg-blanc p-6 md:p-8">
        <p>
          Aucune montre gardée de côté. Touchez le cœur d&apos;une montre pour la retrouver ici.
        </p>
        <Button asChild variante="secondaire" className="mt-6">
          <Link href="/montres">Parcourir les montres</Link>
        </Button>
      </div>
    );
  }
  return <GrilleProduits produits={produits} colonnes={3} niveauTitre="h2" />;
}

export default function PageFavoris() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl">Mes favoris</h1>
      <div className="mt-10">
        <Suspense fallback={<div aria-hidden className="h-64" />}>
          <Favoris />
        </Suspense>
      </div>
    </>
  );
}
