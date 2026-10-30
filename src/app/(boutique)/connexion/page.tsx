import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FormulaireConnexion } from "@/components/compte/formulaire-connexion";
import { FormulaireIdentifiants } from "@/components/compte/formulaire-identifiants";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { googleConfigure, lienMagiqueConfigure } from "@/lib/auth";
import { cheminRetour } from "@/lib/compte/regles";
import { clientConnecte } from "@/lib/compte/serveur";
import { connexionGoogle } from "@/server/actions/compte";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

/** Codes d'erreur renvoyés par Auth.js dans l'URL. */
const erreurs: Record<string, string> = {
  Verification: "Ce lien a expiré ou a déjà servi. Demandez-en un nouveau ci-dessous.",
  OAuthAccountNotLinked: "Cette adresse est déjà liée à un autre mode de connexion.",
  AccessDenied: "La connexion a été refusée.",
};

function Separateur() {
  return (
    <p className="my-8 flex items-center gap-4 text-sm text-graphite before:h-px before:flex-1 before:bg-filet after:h-px after:flex-1 after:bg-filet">
      ou
    </p>
  );
}

async function ContenuConnexion({ searchParams }: Pick<PageProps<"/connexion">, "searchParams">) {
  const parametres = await searchParams;
  const retour = cheminRetour(parametres.retour);
  if (await clientConnecte()) redirect(retour);

  const code = typeof parametres.error === "string" ? parametres.error : null;
  const erreur = code && (erreurs[code] ?? "La connexion n'a pas abouti. Réessayez.");

  return (
    <>
      {erreur && (
        <p role="alert" className="mt-6 text-sm text-bordeaux">
          {erreur}
        </p>
      )}
      <div className="mt-8">
        <FormulaireIdentifiants mode="connexion" retour={retour} />
      </div>
      <p className="mt-6 text-sm text-graphite">
        Pas encore de compte ?{" "}
        <TextLink href={`/inscription?retour=${encodeURIComponent(retour)}`}>
          Créer un compte
        </TextLink>
      </p>
      {lienMagiqueConfigure && (
        <>
          <Separateur />
          <FormulaireConnexion retour={retour} />
          <p className="mt-4 text-sm text-graphite">
            Les commandes passées sans compte avec la même adresse rejoignent votre compte dès la
            connexion par lien.
          </p>
        </>
      )}
      {googleConfigure && (
        <>
          <Separateur />
          <form action={connexionGoogle}>
            <input type="hidden" name="retour" value={retour} />
            <Button type="submit" variante="secondaire" taille="lg" pleineLargeur>
              Continuer avec Google
            </Button>
          </form>
        </>
      )}
    </>
  );
}

export default function PageConnexion({ searchParams }: PageProps<"/connexion">) {
  return (
    <Container className="py-12 md:py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-4xl md:text-5xl">Connexion</h1>
        <p className="mt-4 leading-relaxed text-graphite">
          Retrouvez vos commandes, vos factures, vos adresses et les montres que vous gardez de
          côté.
        </p>
        <Suspense fallback={<div aria-hidden className="h-56" />}>
          <ContenuConnexion searchParams={searchParams} />
        </Suspense>
        <p className="mt-8 text-sm text-graphite">L&apos;achat reste possible sans compte.</p>
      </div>
    </Container>
  );
}
