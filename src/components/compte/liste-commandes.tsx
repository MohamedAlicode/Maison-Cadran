import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/generated/prisma/enums";
import type { ResumeCommande } from "@/lib/compte/serveur";
import { formatDate } from "@/lib/facture/lignes";
import { libellesStatutCommande } from "@/lib/libelles";
import { formatPrix } from "@/lib/prix";

const variantesStatut: Record<OrderStatus, "cadran" | "succes" | "neutre"> = {
  PENDING: "neutre",
  PAID: "cadran",
  PREPARING: "cadran",
  SHIPPED: "cadran",
  DELIVERED: "succes",
  REFUNDED: "neutre",
  CANCELLED: "neutre",
};

export function BadgeStatut({ statut }: { statut: OrderStatus }) {
  return <Badge variante={variantesStatut[statut]}>{libellesStatutCommande[statut]}</Badge>;
}

/** Une ligne par commande, toute la ligne mène au détail. */
export function ListeCommandes({ commandes }: { commandes: ResumeCommande[] }) {
  return (
    <ul className="divide-y divide-filet rounded-cadre bg-blanc">
      {commandes.map((commande) => (
        <li key={commande.number} className="relative flex items-center gap-4 p-4 md:gap-6 md:p-6">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-controle bg-acier md:size-20">
            {commande.items[0]?.imageUrl && (
              <Image
                src={commande.items[0].imageUrl}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg leading-snug">
              <Link
                href={`/compte/commandes/${commande.number}`}
                className="after:absolute after:inset-0 hover:text-cadran focus-visible:outline-none focus-visible:after:rounded-cadre focus-visible:after:outline-2 focus-visible:after:outline-cadran"
              >
                {commande.items.map((i) => `${i.brandName} ${i.productName}`).join(", ")}
              </Link>
            </p>
            <p className="chiffres mt-1 text-sm text-graphite">
              {commande.number} · {formatDate(commande.paidAt ?? commande.createdAt)}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <p className="chiffres">{formatPrix(commande.totalCents)}</p>
            <BadgeStatut statut={commande.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}
