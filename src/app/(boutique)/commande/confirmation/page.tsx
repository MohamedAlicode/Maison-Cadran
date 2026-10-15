import { CircleCheck, Clock, FileText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ActualisationAttente } from "@/components/panier/actualisation-attente";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { boutique } from "@/config/boutique";
import type { Adresse } from "@/lib/commandes/adresse";
import { chargerCommande, type CommandeComplete } from "@/lib/commandes/donnees";
import { formatPrix } from "@/lib/prix";
import { reprendreSelection } from "@/server/actions/panier";

export const metadata: Metadata = {
  title: "Votre commande",
  robots: { index: false },
};

function nomsMontres(commande: CommandeComplete) {
  return commande.items.map((item) => `${item.brandName} ${item.productName}`).join(", ");
}

function LienContact() {
  return (
    <a
      href={`mailto:${boutique.contact.email}`}
      className="text-encre underline decoration-filet-fort underline-offset-4 hover:text-cadran"
    >
      {boutique.contact.email}
    </a>
  );
}

function BlocAdresse({ titre, adresse }: { titre: string; adresse: Adresse | null }) {
  if (!adresse) return null;
  return (
    <div>
      <h2 className="font-sans text-sm font-medium text-graphite">{titre}</h2>
      <address className="mt-2 text-sm leading-relaxed not-italic">
        {adresse.nom}
        <br />
        {adresse.ligne1}
        {adresse.ligne2 && (
          <>
            <br />
            {adresse.ligne2}
          </>
        )}
        <br />
        {adresse.codePostal} {adresse.ville}
      </address>
    </div>
  );
}

function Recapitulatif({ commande }: { commande: CommandeComplete }) {
  return (
    <section
      aria-labelledby="titre-recap"
      className="rounded-cadre bg-blanc p-6 md:p-8 lg:self-start"
    >
      <h2 id="titre-recap" className="font-serif text-2xl">
        Commande {commande.number}
      </h2>
      <ul className="mt-6 divide-y divide-filet border-y border-filet">
        {commande.items.map((item) => (
          <li key={item.id} className="flex gap-4 py-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-controle bg-acier">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt="" fill sizes="80px" className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 justify-between gap-4">
              <div>
                <p className="font-serif text-lg leading-snug">
                  <span className="text-graphite">{item.brandName}</span> {item.productName}
                </p>
                <p className="chiffres text-sm text-graphite">
                  Réf. {item.reference}
                  {item.quantity > 1 && ` · ${item.quantity} exemplaires`}
                </p>
              </div>
              <p className="chiffres shrink-0">{formatPrix(item.unitPriceCents * item.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>
      <dl className="chiffres mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Sous-total</dt>
          <dd>{formatPrix(commande.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Livraison</dt>
          <dd>{commande.shippingCents === 0 ? "Offerte" : formatPrix(commande.shippingCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-filet pt-3 text-base font-medium">
          <dt>Total TTC</dt>
          <dd>{formatPrix(commande.totalCents)}</dd>
        </div>
      </dl>
    </section>
  );
}

async function ContenuConfirmation({
  searchParams,
}: Pick<PageProps<"/commande/confirmation">, "searchParams">) {
  const { session_id } = await searchParams;
  const commande =
    typeof session_id === "string"
      ? await chargerCommande({ stripeCheckoutSessionId: session_id })
      : null;

  if (!commande) {
    return (
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl">Commande introuvable</h1>
        <p className="mt-4 leading-relaxed text-graphite">
          Ce lien ne correspond à aucune commande. Si vous venez de payer, vérifiez l&apos;e-mail de
          confirmation ou écrivez-nous à <LienContact />.
        </p>
        <Button asChild variante="secondaire" className="mt-8">
          <Link href="/montres">Retour aux montres</Link>
        </Button>
      </div>
    );
  }

  if (commande.status === "PENDING") {
    return (
      <div className="max-w-xl" role="status">
        <Clock aria-hidden className="size-8 text-cadran" strokeWidth={1.5} />
        <h1 className="mt-4 text-4xl md:text-5xl">Paiement en cours de confirmation</h1>
        <ActualisationAttente />
      </div>
    );
  }

  // Seule une rupture de stock annule une commande après encaissement : c'est donc le seul cas
  // où l'identifiant du paiement est enregistré. Sans lui, la banque a refusé le paiement.
  if (commande.status === "CANCELLED" && !commande.stripePaymentIntentId) {
    return (
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl">Paiement non abouti</h1>
        <p className="mt-4 leading-relaxed text-graphite">
          Votre banque n&apos;a pas validé le paiement de la commande {commande.number} (
          {nomsMontres(commande)}) : rien n&apos;a été débité. Vous pouvez remettre votre sélection
          dans le panier et réessayer, ou nous écrire à <LienContact />.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <form action={reprendreSelection.bind(null, commande.stripeCheckoutSessionId ?? "")}>
            <Button type="submit">Remettre ma sélection dans le panier</Button>
          </form>
          <Button asChild variante="fantome">
            <Link href="/montres">Retour aux montres</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (commande.status === "CANCELLED" || commande.status === "REFUNDED") {
    return (
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl">Toutes nos excuses</h1>
        <p className="mt-4 leading-relaxed text-graphite">
          La dernière pièce de votre sélection ({nomsMontres(commande)}) a été réservée par un autre
          client au moment même de votre paiement. Nous ne pouvons donc pas honorer votre commande{" "}
          {commande.number}.
        </p>
        <p className="mt-4 leading-relaxed text-graphite">
          {commande.status === "REFUNDED"
            ? `Vous êtes intégralement remboursé de ${formatPrix(commande.totalCents)} : le montant apparaîtra sur votre compte sous 5 à 10 jours, selon votre banque.`
            : `Votre remboursement de ${formatPrix(commande.totalCents)} est en cours : nous vous écrirons dès qu'il sera effectué.`}{" "}
          Répondez à notre e-mail ou écrivez-nous à <LienContact /> : nous vous aiderons à trouver
          une montre proche.
        </p>
        <Button asChild variante="secondaire" className="mt-8">
          <Link href="/montres">Retour aux montres</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_28rem] lg:gap-16 xl:gap-24">
      <div>
        <CircleCheck aria-hidden className="size-8 text-sauge" strokeWidth={1.5} />
        <h1 className="mt-4 text-4xl md:text-5xl">Merci pour votre commande</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-graphite">
          Votre paiement est confirmé. Nous préparons votre montre avec soin et vous écrirons dès
          son expédition, avec le numéro de suivi.
          {commande.email && ` La confirmation a été envoyée à ${commande.email}.`}
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <BlocAdresse titre="Livraison" adresse={commande.adresseLivraison} />
          <BlocAdresse titre="Facturation" adresse={commande.adresseFacturation} />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {commande.invoice && (
            <Button asChild variante="secondaire">
              <a
                href={`/api/factures/${commande.invoice.number}?session_id=${commande.stripeCheckoutSessionId}`}
              >
                <FileText aria-hidden className="size-4" strokeWidth={1.5} />
                Télécharger la facture
              </a>
            </Button>
          )}
          <Button asChild variante="fantome">
            <Link href="/montres">Continuer la visite</Link>
          </Button>
        </div>
      </div>
      <Recapitulatif commande={commande} />
    </div>
  );
}

export default function PageConfirmation({ searchParams }: PageProps<"/commande/confirmation">) {
  return (
    <Container className="py-12 md:py-20">
      <Suspense fallback={<div aria-hidden className="h-96" />}>
        <ContenuConfirmation searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
