import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AvancerCommande, RembourserCommande } from "@/components/admin/actions-commande";
import { BadgeStatut } from "@/components/compte/liste-commandes";
import { BlocAdresse, RecapitulatifCommande } from "@/components/commande/recapitulatif-commande";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { commandePourAdmin } from "@/lib/admin/commandes";
import { estRemboursable, etapeSuivante } from "@/lib/admin/regles";
import { exigerAdmin } from "@/lib/admin/serveur";
import { libellesStatutCommande } from "@/lib/libelles";
import { formatPrix } from "@/lib/prix";

export const instant = false;

const formateurHorodatage = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

export async function generateMetadata({
  params,
}: PageProps<"/admin/commandes/[numero]">): Promise<Metadata> {
  const { numero } = await params;
  return { title: `Commande ${numero}` };
}

async function DetailCommande({ params }: Pick<PageProps<"/admin/commandes/[numero]">, "params">) {
  const { numero } = await params;
  await exigerAdmin(`/admin/commandes/${numero}`);
  const commande = await commandePourAdmin(numero);
  if (!commande) notFound();
  const suivante = etapeSuivante[commande.status];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="chiffres text-4xl md:text-5xl">{commande.number}</h1>
        <BadgeStatut statut={commande.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="grid content-start gap-6">
          {suivante && (
            <AvancerCommande numero={commande.number} depuis={commande.status} vers={suivante} />
          )}
          {estRemboursable(commande.status, commande.stripePaymentIntentId) && (
            <RembourserCommande
              numero={commande.number}
              montant={formatPrix(commande.totalCents)}
              stockSorti={commande.paidAt !== null}
            />
          )}

          <section className="grid gap-6 rounded-cadre bg-blanc p-6 sm:grid-cols-2 md:p-8">
            <h2 className="font-serif text-2xl sm:col-span-2">Client</h2>
            <p className="sm:col-span-2">{commande.email ?? "E-mail inconnu"}</p>
            <BlocAdresse titre="Livraison" adresse={commande.adresseLivraison} />
            <BlocAdresse titre="Facturation" adresse={commande.adresseFacturation} />
            {commande.trackingNumber && (
              <p className="text-sm sm:col-span-2">
                {commande.carrier} · <span className="chiffres">{commande.trackingNumber}</span>
                {commande.trackingUrl && (
                  <>
                    {" "}
                    · <TextLink href={commande.trackingUrl}>Suivre le colis</TextLink>
                  </>
                )}
              </p>
            )}
          </section>

          <section className="rounded-cadre bg-blanc p-6 md:p-8">
            <h2 className="mb-6 font-serif text-2xl">Historique</h2>
            {commande.evenements.length ? (
              <ol className="grid gap-4">
                {commande.evenements.map((e) => (
                  <li key={e.id} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                    <span className="chiffres text-sm text-graphite">
                      {formateurHorodatage.format(e.createdAt)}
                    </span>
                    <span>
                      {libellesStatutCommande[e.status]}
                      {(e.note || e.auteur) && (
                        <span className="block text-sm text-graphite">
                          {[e.note, e.auteur && `par ${e.auteur}`].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-graphite">Aucun événement.</p>
            )}
          </section>
        </div>

        <div className="grid content-start gap-6">
          <RecapitulatifCommande commande={commande} />
          {commande.invoice && (
            <Button asChild variante="secondaire" className="justify-self-start">
              <a href={`/api/factures/${commande.invoice.number}`}>
                <FileText aria-hidden className="size-4" strokeWidth={1.5} />
                Facture {commande.invoice.number}
              </a>
            </Button>
          )}
        </div>
      </div>

      <TextLink href="/admin/commandes" className="mt-12 inline-block">
        Toutes les commandes
      </TextLink>
    </>
  );
}

export default function PageCommande({ params }: PageProps<"/admin/commandes/[numero]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-96" />}>
      <DetailCommande params={params} />
    </Suspense>
  );
}
