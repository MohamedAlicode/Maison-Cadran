import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ListeCommandes } from "@/components/compte/liste-commandes";
import { Button } from "@/components/ui/button";
import { commandesClient, exigerClient } from "@/lib/compte/serveur";

export const metadata: Metadata = { title: "Mes commandes" };

async function Commandes() {
  const client = await exigerClient("/compte/commandes");
  const commandes = await commandesClient(client.id);
  if (commandes.length === 0) {
    return (
      <div className="rounded-cadre bg-blanc p-6 md:p-8">
        <p>
          Aucune commande pour le moment. Celles passées sans compte avec {client.email}{" "}
          apparaîtront ici automatiquement.
        </p>
        <Button asChild variante="secondaire" className="mt-6">
          <Link href="/montres">Découvrir les montres</Link>
        </Button>
      </div>
    );
  }
  return <ListeCommandes commandes={commandes} />;
}

export default function PageCommandes() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl">Mes commandes</h1>
      <div className="mt-10">
        <Suspense fallback={<div aria-hidden className="h-64" />}>
          <Commandes />
        </Suspense>
      </div>
    </>
  );
}
