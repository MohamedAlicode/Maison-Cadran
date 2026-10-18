import Link from "next/link";
import { Suspense } from "react";
import { Confirmation, EnTeteAdmin } from "@/components/admin/en-tete";
import { Badge } from "@/components/ui/badge";
import { listeCodesPromoAdmin } from "@/lib/admin/codes-promo";
import { exigerAdmin } from "@/lib/admin/serveur";
import { formatDate } from "@/lib/facture/lignes";
import { formatPrixCourt } from "@/lib/prix";

export const metadata = { title: "Codes promo" };

async function ListeCodes({ searchParams }: PageProps<"/admin/codes-promo">) {
  await exigerAdmin("/admin/codes-promo");
  const [{ enregistre }, codes] = await Promise.all([searchParams, listeCodesPromoAdmin()]);
  const maintenant = new Date();

  return (
    <>
      <Confirmation visible={enregistre === "1"}>Code enregistré.</Confirmation>
      {codes.length ? (
        <ul className="divide-y divide-filet rounded-cadre bg-blanc">
          {codes.map((c) => {
            const expire = c.endsAt !== null && c.endsAt <= maintenant;
            return (
              <li key={c.id}>
                <Link
                  href={`/admin/codes-promo/${c.id}`}
                  className="grid gap-x-6 gap-y-2 p-4 hover:text-cadran md:grid-cols-[1fr_8rem_auto] md:items-center md:px-6"
                >
                  <span className="min-w-0">
                    <span className="chiffres block font-medium">{c.code}</span>
                    <span className="block text-sm text-graphite">
                      {c.type === "PERCENT" ? `−${c.value} %` : `−${formatPrixCourt(c.value)}`}
                      {c.minOrderCents && ` dès ${formatPrixCourt(c.minOrderCents)}`}
                      {c.endsAt && ` · jusqu'au ${formatDate(new Date(c.endsAt.getTime() - 1))}`}
                    </span>
                  </span>
                  <span className="chiffres text-sm text-graphite md:text-right">
                    {c.usesCount}
                    {c.maxUses !== null && ` / ${c.maxUses}`} utilisation
                    {c.usesCount > 1 && "s"}
                  </span>
                  <span className="flex flex-wrap gap-2 md:justify-end">
                    {c.showInBanner && c.isActive && !expire && (
                      <Badge variante="cadran">Banderole</Badge>
                    )}
                    <Badge variante={c.isActive && !expire ? "succes" : "neutre"}>
                      {expire ? "Expiré" : c.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-cadre bg-blanc p-6 text-sm text-graphite">
          Aucun code promo pour le moment.
        </p>
      )}
    </>
  );
}

export default function PageCodesPromo(props: PageProps<"/admin/codes-promo">) {
  return (
    <>
      <EnTeteAdmin
        titre="Codes promo"
        action={{ href: "/admin/codes-promo/nouveau", libelle: "Créer un code" }}
      />
      <Suspense fallback={<div aria-hidden className="h-64" />}>
        <ListeCodes {...props} />
      </Suspense>
    </>
  );
}
