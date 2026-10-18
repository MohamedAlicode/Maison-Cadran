import Image from "next/image";
import type { Adresse } from "@/lib/commandes/adresse";
import type { CommandeComplete } from "@/lib/commandes/donnees";
import { formatPrix } from "@/lib/prix";

/** Adresse figée dans une commande ; rien si elle manque. */
export function BlocAdresse({ titre, adresse }: { titre: string; adresse: Adresse | null }) {
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

/** Montres, montants et numéro d'une commande : confirmation et espace client. */
export function RecapitulatifCommande({ commande }: { commande: CommandeComplete }) {
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
