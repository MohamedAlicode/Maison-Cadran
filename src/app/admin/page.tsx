import Link from "next/link";
import { Suspense } from "react";
import { BadgeStatut } from "@/components/compte/liste-commandes";
import { TextLink } from "@/components/ui/text-link";
import { exigerAdmin } from "@/lib/admin/serveur";
import { chiffresTableauDeBord } from "@/lib/admin/tableau-de-bord";
import { formatDate } from "@/lib/facture/lignes";
import { formatPrix } from "@/lib/prix";

async function TableauDeBord() {
  await exigerAdmin("/admin");
  const c = await chiffresTableauDeBord();

  const chiffres = [
    { libelle: "Chiffre d'affaires, 30 jours", valeur: formatPrix(c.chiffreAffaires) },
    { libelle: "Commandes payées, 30 jours", valeur: String(c.commandes) },
    { libelle: "Panier moyen", valeur: c.commandes ? formatPrix(c.panierMoyen) : "–" },
  ];
  const aTraiter = [
    { libelle: "Commandes à préparer", nombre: c.aPreparer, href: "/admin/commandes?statut=PAID" },
    {
      libelle: "Commandes à expédier",
      nombre: c.aExpedier,
      href: "/admin/commandes?statut=PREPARING",
    },
    { libelle: "Stocks bas", nombre: c.stocksBas.length, href: "/admin/produits?stock=bas" },
    { libelle: "Avis des 7 derniers jours", nombre: c.avisRecents, href: "/admin/avis" },
  ];

  return (
    <>
      <h1 className="text-4xl md:text-5xl">Tableau de bord</h1>

      <dl className="mt-10 grid divide-filet rounded-cadre bg-blanc max-md:divide-y md:grid-cols-3 md:divide-x">
        {chiffres.map(({ libelle, valeur }) => (
          <div key={libelle} className="flex flex-col-reverse gap-2 p-6">
            <dt className="text-sm text-graphite">{libelle}</dt>
            <dd className="chiffres font-serif text-3xl">{valeur}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="titre-a-traiter" className="rounded-cadre bg-blanc p-6">
          <h2 id="titre-a-traiter" className="text-2xl">
            À traiter
          </h2>
          <ul className="mt-4 divide-y divide-filet">
            {aTraiter.map(({ libelle, nombre, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex min-h-11 items-center justify-between gap-4 py-2 text-sm hover:text-cadran"
                >
                  {libelle}
                  <span className="chiffres font-medium">{nombre}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="titre-ventes" className="rounded-cadre bg-blanc p-6">
          <h2 id="titre-ventes" className="text-2xl">
            Meilleures ventes
          </h2>
          {c.meilleuresVentes.length ? (
            <ol className="mt-4 divide-y divide-filet">
              {c.meilleuresVentes.map((v) => (
                <li
                  key={v.nom}
                  className="flex min-h-11 items-center justify-between gap-4 py-2 text-sm"
                >
                  {v.nom}
                  <span className="chiffres shrink-0 text-graphite">
                    {v.quantite} vendue{v.quantite > 1 ? "s" : ""}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-graphite">Aucune vente encaissée pour le moment.</p>
          )}
        </section>
      </div>

      <section aria-labelledby="titre-dernieres" className="mt-6 rounded-cadre bg-blanc p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h2 id="titre-dernieres" className="text-2xl">
            Dernières commandes
          </h2>
          <TextLink href="/admin/commandes" className="text-sm">
            Toutes les commandes
          </TextLink>
        </div>
        {c.dernieresCommandes.length ? (
          <ul className="mt-4 divide-y divide-filet">
            {c.dernieresCommandes.map((commande) => (
              <li key={commande.number}>
                <Link
                  href={`/admin/commandes/${commande.number}`}
                  className="grid gap-1 py-3 text-sm hover:text-cadran sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6"
                >
                  <span>
                    <span className="chiffres font-medium">{commande.number}</span>
                    <span className="text-graphite"> · {formatDate(commande.createdAt)}</span>
                  </span>
                  <BadgeStatut statut={commande.status} />
                  <span className="chiffres sm:text-right">{formatPrix(commande.totalCents)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-graphite">Aucune commande pour le moment.</p>
        )}
      </section>
    </>
  );
}

export default function PageAdmin() {
  return (
    <Suspense fallback={<div aria-hidden className="h-96" />}>
      <TableauDeBord />
    </Suspense>
  );
}
