import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export type EntreeSommaire = { id: string; titre: string };

type Proprietes = {
  titre: string;
  introduction: ReactNode;
  /** Rubriques listées dans le sommaire, dans l'ordre des sections de la page. */
  rubriques?: EntreeSommaire[];
  /** Date de dernière mise à jour, affichée sous l'introduction (pages juridiques). */
  miseAJour?: string;
  children: ReactNode;
};

/**
 * Gabarit des pages de lecture (guide, FAQ, pages juridiques) : titre, introduction,
 * sommaire collant à gauche sur grand écran, texte limité à 65 caractères de large.
 */
export function PageEditoriale({
  titre,
  introduction,
  rubriques = [],
  miseAJour,
  children,
}: Proprietes) {
  return (
    <Container className="pt-10 pb-20 md:pt-14 md:pb-28">
      <Breadcrumb miettes={[{ libelle: "Accueil", href: "/" }, { libelle: titre }]} />
      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl leading-affiche md:text-6xl">{titre}</h1>
        <span aria-hidden className="mt-6 block h-px w-12 bg-cadran" />
        <div className="mt-6 text-lg leading-relaxed text-graphite">{introduction}</div>
        {miseAJour && <p className="mt-4 text-sm text-graphite">Mise à jour le {miseAJour}.</p>}
      </header>

      <div
        className={cn(
          "mt-14 md:mt-20",
          rubriques.length > 0 && "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16",
        )}
      >
        {rubriques.length > 0 && <Sommaire rubriques={rubriques} />}
        <div className="max-w-prose">{children}</div>
      </div>
    </Container>
  );
}

/** Sommaire : liste repliée en tête de texte sur mobile, colonne collante dès 1 024 px. */
function Sommaire({ rubriques }: { rubriques: EntreeSommaire[] }) {
  return (
    <nav
      aria-label="Sommaire"
      className="mb-12 border-y border-filet py-5 lg:mb-0 lg:border-0 lg:py-0"
    >
      <div className="lg:sticky lg:top-28">
        <p className="text-sm font-medium">Sur cette page</p>
        <ol className="mt-3 space-y-1 text-sm text-graphite">
          {rubriques.map((r) => (
            <li key={r.id}>
              <a
                href={`#${r.id}`}
                className="inline-block py-1.5 transition-colors duration-(--duree-courte) ease-maison hover:text-cadran"
              >
                {r.titre}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

/** Section de texte long, ancrée pour le sommaire. */
export function Rubrique({
  id,
  titre,
  children,
  className,
}: EntreeSommaire & { children: ReactNode; className?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titre`}
      // Décalage d'ancre : l'en-tête collant mesure 66 px.
      className={cn(
        "scroll-mt-28 border-t border-filet pt-10 pb-14 first:border-0 first:pt-0",
        className,
      )}
    >
      <h2 id={`${id}-titre`} className="text-2xl leading-titre md:text-3xl">
        {titre}
      </h2>
      <div className="redaction mt-5">{children}</div>
    </section>
  );
}

/** Grille de repères : une ligne par cas, le chiffre à gauche, l'explication à droite. */
export function Reperes({ lignes }: { lignes: { terme: string; detail: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-filet border-y border-filet">
      {lignes.map((l) => (
        <div key={l.terme} className="grid gap-1 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
          <dt className="chiffres font-medium">{l.terme}</dt>
          <dd className="text-graphite">{l.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Encadré d'information neutre (texte provisoire, précision importante). */
export function Encadre({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-xs border border-filet bg-blanc p-5 text-sm leading-relaxed text-graphite",
        className,
      )}
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-cadran" strokeWidth={1.5} />
      <div>{children}</div>
    </aside>
  );
}

/** Valeur légale : un « [à compléter] » est surligné pour être repéré avant l'ouverture. */
export function ValeurLegale({ valeur }: { valeur: string }) {
  if (!valeur.startsWith("[")) return <>{valeur}</>;
  return <mark className="rounded-xs bg-ambre/10 px-1 text-ambre">{valeur}</mark>;
}
