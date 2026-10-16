import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormulaireAdresse, type AdresseSaisie } from "@/components/compte/formulaire-adresse";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Address } from "@/generated/prisma/client";
import { exigerClient } from "@/lib/compte/serveur";
import { db } from "@/lib/db";
import { definirAdresseParDefaut, supprimerAdresse } from "@/server/actions/compte";

export const metadata: Metadata = { title: "Mes adresses" };

const classeAction =
  "text-sm text-graphite underline decoration-filet-fort underline-offset-4 hover:text-cadran";

async function Adresses({ searchParams }: Pick<PageProps<"/compte/adresses">, "searchParams">) {
  const client = await exigerClient("/compte/adresses");
  const [{ modifier, ajouter }, adresses] = await Promise.all([
    searchParams,
    db.address.findMany({
      where: { userId: client.id },
      orderBy: [{ isDefault: "desc" }, { id: "asc" }],
    }),
  ]);

  const enEdition = adresses.find((a) => a.id === modifier);
  const formulaireOuvert = Boolean(enEdition) || ajouter !== undefined || adresses.length === 0;

  return (
    <>
      {adresses.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2">
          {adresses.map((a) => (
            <li key={a.id} className="flex flex-col rounded-cadre bg-blanc p-6">
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium">{a.label ?? `${a.firstName} ${a.lastName}`}</p>
                {a.isDefault && <Badge variante="cadran">Par défaut</Badge>}
              </div>
              <address className="mt-3 flex-1 text-sm leading-relaxed text-graphite not-italic">
                {a.firstName} {a.lastName}
                {a.company && (
                  <>
                    <br />
                    {a.company}
                  </>
                )}
                <br />
                {a.line1}
                {a.line2 && (
                  <>
                    <br />
                    {a.line2}
                  </>
                )}
                <br />
                {a.postalCode} {a.city}
                <br />
                <span className="chiffres">{a.phone}</span>
              </address>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <Link
                  href={`/compte/adresses?modifier=${a.id}`}
                  scroll={false}
                  className={classeAction}
                >
                  Modifier
                </Link>
                {!a.isDefault && (
                  <form action={definirAdresseParDefaut.bind(null, a.id)}>
                    <button type="submit" className={classeAction}>
                      Utiliser par défaut
                    </button>
                  </form>
                )}
                <form action={supprimerAdresse.bind(null, a.id)}>
                  <button type="submit" className={classeAction}>
                    Supprimer
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {formulaireOuvert ? (
        <section
          aria-labelledby="titre-formulaire"
          className="mt-10 max-w-2xl rounded-cadre bg-blanc p-6 md:p-8"
        >
          <h2 id="titre-formulaire" className="text-2xl md:text-3xl">
            {enEdition ? "Modifier l'adresse" : "Nouvelle adresse"}
          </h2>
          <p className="mt-2 text-sm text-graphite">Livraison en France métropolitaine.</p>
          <div className="mt-6">
            <FormulaireAdresse
              key={enEdition?.id ?? "nouvelle"}
              adresse={enEdition && versSaisie(enEdition)}
            />
          </div>
        </section>
      ) : (
        adresses.length < 10 && (
          <Button asChild variante="secondaire" className="mt-8">
            <Link href="/compte/adresses?ajouter" scroll={false}>
              <Plus aria-hidden className="size-4" strokeWidth={1.5} />
              Ajouter une adresse
            </Link>
          </Button>
        )
      )}
    </>
  );
}

function versSaisie(a: Address): AdresseSaisie {
  return {
    id: a.id,
    libelle: a.label ?? "",
    prenom: a.firstName,
    nom: a.lastName,
    societe: a.company ?? "",
    ligne1: a.line1,
    ligne2: a.line2 ?? "",
    codePostal: a.postalCode,
    ville: a.city,
    telephone: a.phone,
    parDefaut: a.isDefault,
  };
}

export default function PageAdresses({ searchParams }: PageProps<"/compte/adresses">) {
  return (
    <>
      <h1 className="text-4xl md:text-5xl">Mes adresses</h1>
      <div className="mt-10">
        <Suspense fallback={<div aria-hidden className="h-64" />}>
          <Adresses searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
