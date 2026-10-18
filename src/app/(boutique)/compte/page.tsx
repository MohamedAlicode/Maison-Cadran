import Link from "next/link";
import { Suspense } from "react";
import { ListeCommandes } from "@/components/compte/liste-commandes";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { commandesClient, exigerClient, idsFavoris } from "@/lib/compte/serveur";
import { db } from "@/lib/db";

async function TableauDeBord() {
  const client = await exigerClient("/compte");
  const [commandes, favoris, adresse] = await Promise.all([
    commandesClient(client.id, 3),
    idsFavoris(client.id),
    db.address.findFirst({
      where: { userId: client.id, isDefault: true },
      select: { firstName: true, lastName: true, line1: true, postalCode: true, city: true },
    }),
  ]);

  return (
    <>
      <h1 className="text-4xl md:text-5xl">Bonjour{client.nom && `, ${client.nom}`}</h1>
      <p className="mt-3 text-graphite">Connecté avec {client.email}</p>

      <section aria-labelledby="titre-commandes" className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h2 id="titre-commandes" className="text-2xl md:text-3xl">
            Dernières commandes
          </h2>
          {commandes.length > 0 && (
            <TextLink href="/compte/commandes">Toutes mes commandes</TextLink>
          )}
        </div>
        <div className="mt-6">
          {commandes.length > 0 ? (
            <ListeCommandes commandes={commandes} />
          ) : (
            <div className="rounded-cadre bg-blanc p-6 md:p-8">
              <p>Aucune commande pour le moment.</p>
              <Button asChild variante="secondaire" className="mt-6">
                <Link href="/montres">Découvrir les montres</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="titre-adresse" className="rounded-cadre bg-blanc p-6 md:p-8">
          <h2 id="titre-adresse" className="text-2xl">
            Adresse de livraison
          </h2>
          {adresse ? (
            <address className="mt-4 text-sm leading-relaxed not-italic">
              {adresse.firstName} {adresse.lastName}
              <br />
              {adresse.line1}
              <br />
              {adresse.postalCode} {adresse.city}
            </address>
          ) : (
            <p className="mt-4 text-sm text-graphite">Aucune adresse enregistrée.</p>
          )}
          <TextLink href="/compte/adresses" className="mt-6 inline-block">
            {adresse ? "Gérer mes adresses" : "Ajouter une adresse"}
          </TextLink>
        </section>
        <section aria-labelledby="titre-favoris" className="rounded-cadre bg-blanc p-6 md:p-8">
          <h2 id="titre-favoris" className="text-2xl">
            Favoris
          </h2>
          <p className="mt-4 text-sm text-graphite">
            {favoris.length === 0
              ? "Touchez le cœur d'une montre pour la garder de côté."
              : `${favoris.length} montre${favoris.length > 1 ? "s" : ""} gardée${favoris.length > 1 ? "s" : ""} de côté.`}
          </p>
          <TextLink
            href={favoris.length ? "/compte/favoris" : "/montres"}
            className="mt-6 inline-block"
          >
            {favoris.length ? "Voir mes favoris" : "Parcourir les montres"}
          </TextLink>
        </section>
      </div>
    </>
  );
}

export default function PageCompte() {
  return (
    <Suspense fallback={<div aria-hidden className="h-96" />}>
      <TableauDeBord />
    </Suspense>
  );
}
