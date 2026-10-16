import { Check, FileText, Truck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BadgeStatut } from "@/components/compte/liste-commandes";
import { BlocAdresse, RecapitulatifCommande } from "@/components/commande/recapitulatif-commande";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { chargerCommande } from "@/lib/commandes/donnees";
import { exigerClient } from "@/lib/compte/serveur";
import { formatDate } from "@/lib/facture/lignes";
import { cn } from "@/lib/utils";

// Page privée, rendue à chaque demande : il n'y a pas de coquille statique à précalculer
// pour un numéro de commande, donc pas de navigation instantanée à valider.
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/compte/commandes/[numero]">): Promise<Metadata> {
  const { numero } = await params;
  return { title: `Commande ${numero}` };
}

async function DetailCommande({ params }: Pick<PageProps<"/compte/commandes/[numero]">, "params">) {
  const { numero } = await params;
  const client = await exigerClient(`/compte/commandes/${numero}`);
  const commande = await chargerCommande({ number: numero });
  // Une commande d'un autre client répond comme une commande inexistante.
  if (!commande || commande.userId !== client.id || commande.status === "PENDING") notFound();

  const etapes = [
    { libelle: "Payée", date: commande.paidAt },
    { libelle: "En préparation", date: commande.preparedAt },
    { libelle: "Expédiée", date: commande.shippedAt },
    { libelle: "Livrée", date: commande.deliveredAt },
  ];
  const annulee = commande.status === "CANCELLED" || commande.status === "REFUNDED";

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="chiffres text-4xl md:text-5xl">{commande.number}</h1>
        <BadgeStatut statut={commande.status} />
      </div>
      <p className="mt-3 text-graphite">
        Passée le {formatDate(commande.paidAt ?? commande.createdAt)}
      </p>

      <div className="mt-10 grid gap-10 xl:grid-cols-[1fr_26rem] xl:gap-16">
        <div>
          {annulee ? (
            <p className="max-w-xl leading-relaxed text-graphite">
              {commande.status === "REFUNDED"
                ? "Cette commande n'a pas pu être honorée : vous avez été intégralement remboursé."
                : "Cette commande n'a pas pu être honorée : votre remboursement est en cours."}
            </p>
          ) : (
            <ol aria-label="Suivi de la commande" className="grid gap-4 sm:grid-cols-4">
              {etapes.map(({ libelle, date }) => (
                <li key={libelle} className="flex items-center gap-3 sm:flex-col sm:items-start">
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full border",
                      date ? "border-cadran bg-cadran text-blanc" : "border-filet-fort",
                    )}
                  >
                    {date && <Check className="size-4" strokeWidth={1.5} />}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{libelle}</span>
                    <span className="chiffres block text-sm text-graphite">
                      {date ? formatDate(date) : "À venir"}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          )}

          {commande.trackingUrl && (
            <Button asChild variante="secondaire" className="mt-8">
              <a href={commande.trackingUrl} target="_blank" rel="noreferrer">
                <Truck aria-hidden className="size-4" strokeWidth={1.5} />
                Suivre le colis
                {commande.trackingNumber && (
                  <span className="chiffres">{commande.trackingNumber}</span>
                )}
              </a>
            </Button>
          )}

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <BlocAdresse titre="Livraison" adresse={commande.adresseLivraison} />
            <BlocAdresse titre="Facturation" adresse={commande.adresseFacturation} />
          </div>

          {commande.invoice && (
            <Button asChild variante="secondaire" className="mt-10">
              <a href={`/api/factures/${commande.invoice.number}`}>
                <FileText aria-hidden className="size-4" strokeWidth={1.5} />
                Télécharger la facture {commande.invoice.number}
              </a>
            </Button>
          )}
        </div>
        <RecapitulatifCommande commande={commande} />
      </div>

      <TextLink href="/compte/commandes" className="mt-12 inline-block">
        Toutes mes commandes
      </TextLink>
    </>
  );
}

export default function PageDetailCommande({ params }: PageProps<"/compte/commandes/[numero]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-96" />}>
      <DetailCommande params={params} />
    </Suspense>
  );
}
