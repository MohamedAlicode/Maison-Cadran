import { Star } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { BoutonAvis } from "@/components/admin/bouton-avis";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { Badge } from "@/components/ui/badge";
import { exigerAdmin } from "@/lib/admin/serveur";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/facture/lignes";
import { cn } from "@/lib/utils";

export const metadata = { title: "Avis" };

const filtres = [
  { valeur: "", libelle: "Tous" },
  { valeur: "publies", libelle: "Publiés" },
  { valeur: "masques", libelle: "Masqués" },
];

async function ListeAvis({ searchParams }: PageProps<"/admin/avis">) {
  await exigerAdmin("/admin/avis");
  const { statut } = await searchParams;
  const avis = await db.review.findMany({
    where:
      statut === "masques"
        ? { status: "REJECTED" }
        : statut === "publies"
          ? { status: "APPROVED" }
          : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      product: { select: { slug: true, name: true, brand: { select: { name: true } } } },
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <>
      <nav aria-label="Filtrer les avis" className="mb-6 flex flex-wrap gap-2">
        {filtres.map((f) => {
          const actif = (statut ?? "") === f.valeur;
          return (
            <Link
              key={f.valeur}
              href={f.valeur ? `/admin/avis?statut=${f.valeur}` : "/admin/avis"}
              aria-current={actif ? "page" : undefined}
              className={cn(
                "inline-flex h-11 items-center rounded-full px-5 text-sm",
                actif ? "bg-encre text-acier" : "bg-blanc hover:text-cadran",
              )}
            >
              {f.libelle}
            </Link>
          );
        })}
      </nav>
      {avis.length ? (
        <ul className="divide-y divide-filet rounded-cadre bg-blanc">
          {avis.map((a) => {
            const masque = a.status === "REJECTED";
            return (
              <li key={a.id} className="grid gap-3 p-6 md:grid-cols-[1fr_auto] md:gap-8">
                <div className={cn("min-w-0", masque && "text-graphite")}>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <Link
                      href={`/montres/${a.product.slug}`}
                      className="font-medium hover:text-cadran"
                    >
                      {a.product.brand.name} {a.product.name}
                    </Link>
                    <span className="chiffres inline-flex items-center gap-1">
                      <Star
                        aria-hidden
                        className="size-4 fill-current text-cadran"
                        strokeWidth={1.5}
                      />
                      {a.rating}/5
                    </span>
                    {masque && <Badge variante="neutre">Masqué</Badge>}
                  </p>
                  {a.title && <p className="mt-3 font-serif text-lg">{a.title}</p>}
                  <p className="mt-2 leading-relaxed whitespace-pre-line">{a.body}</p>
                  <p className="mt-3 text-sm text-graphite">
                    {a.user.name ?? "Anonyme"} · {a.user.email} · {formatDate(a.createdAt)}
                    {a.orderId && " · Achat vérifié"}
                  </p>
                </div>
                <div className="md:self-start">
                  <BoutonAvis id={a.id} masque={masque} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-cadre bg-blanc p-6 text-sm text-graphite">
          Aucun avis pour le moment.
        </p>
      )}
    </>
  );
}

export default function PageAvis(props: PageProps<"/admin/avis">) {
  return (
    <>
      <EnTeteAdmin titre="Avis">
        <p className="mt-2 max-w-xl text-graphite">
          Les avis sont publiés dès leur dépôt. Masquer un avis le retire de la fiche sans le
          supprimer.
        </p>
      </EnTeteAdmin>
      <Suspense fallback={<div aria-hidden className="h-64" />}>
        <ListeAvis {...props} />
      </Suspense>
    </>
  );
}
