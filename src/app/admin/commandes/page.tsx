import Link from "next/link";
import { Suspense } from "react";
import { ChampSelect } from "@/components/admin/champs";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { BadgeStatut } from "@/components/compte/liste-commandes";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { OrderStatus } from "@/generated/prisma/enums";
import { listeCommandesAdmin } from "@/lib/admin/commandes";
import { exigerAdmin } from "@/lib/admin/serveur";
import { formatDate } from "@/lib/facture/lignes";
import { libellesStatutCommande } from "@/lib/libelles";
import { formatPrix } from "@/lib/prix";

export const metadata = { title: "Commandes" };

async function ListeCommandes({ searchParams }: PageProps<"/admin/commandes">) {
  await exigerAdmin("/admin/commandes");
  const { statut, q } = await searchParams;
  const statutChoisi = Object.values(OrderStatus).find((s) => s === statut);
  const recherche = typeof q === "string" ? q.trim() : "";
  const commandes = await listeCommandesAdmin({ statut: statutChoisi, recherche });

  return (
    <>
      <form className="mb-6 grid gap-4 rounded-cadre bg-blanc p-6 md:grid-cols-[1fr_15rem_auto] md:items-end">
        <Field
          id="recherche"
          name="q"
          type="search"
          label="Rechercher"
          defaultValue={recherche}
          placeholder="Numéro ou e-mail"
        />
        <ChampSelect
          id="statut"
          name="statut"
          label="Statut"
          defaultValue={statutChoisi ?? ""}
          options={[
            { valeur: "", libelle: "Toutes sauf en attente" },
            ...Object.entries(libellesStatutCommande).map(([valeur, libelle]) => ({
              valeur,
              libelle,
            })),
          ]}
        />
        <Button type="submit" variante="secondaire">
          Filtrer
        </Button>
      </form>
      {commandes.length ? (
        <ul className="divide-y divide-filet rounded-cadre bg-blanc">
          {commandes.map((c) => (
            <li key={c.number}>
              <Link
                href={`/admin/commandes/${c.number}`}
                className="grid gap-x-4 gap-y-1 p-4 hover:text-cadran md:grid-cols-[1fr_9rem_7rem_9rem] md:items-center md:px-6"
              >
                <span className="min-w-0">
                  <span className="chiffres block font-medium">{c.number}</span>
                  <span className="block truncate text-sm text-graphite">
                    {c.email ?? "E-mail inconnu"} · {c._count.items}{" "}
                    {c._count.items > 1 ? "articles" : "article"}
                  </span>
                </span>
                <span className="chiffres text-sm text-graphite md:text-right">
                  {formatDate(c.paidAt ?? c.createdAt)}
                </span>
                <span className="chiffres text-sm md:text-right">{formatPrix(c.totalCents)}</span>
                <span className="md:justify-self-end">
                  <BadgeStatut statut={c.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-cadre bg-blanc p-6 text-sm text-graphite">
          Aucune commande ne correspond.
        </p>
      )}
    </>
  );
}

export default function PageCommandes(props: PageProps<"/admin/commandes">) {
  return (
    <>
      <EnTeteAdmin titre="Commandes" />
      <Suspense fallback={<div aria-hidden className="h-96" />}>
        <ListeCommandes {...props} />
      </Suspense>
    </>
  );
}
