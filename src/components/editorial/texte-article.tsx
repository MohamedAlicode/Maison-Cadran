import Link from "next/link";
import { Rubrique } from "@/components/editorial/page-editoriale";
import { slugifier } from "@/lib/admin/regles";
import type { Bloc, Morceau } from "@/lib/articles/texte";

function EnLigne({ morceaux }: { morceaux: Morceau[] }) {
  return morceaux.map((m, i) =>
    m.type === "gras" ? (
      <strong key={i}>{m.texte}</strong>
    ) : m.type === "lien" ? (
      <Link key={i} href={m.href}>
        {m.texte}
      </Link>
    ) : (
      m.texte
    ),
  );
}

function Blocs({ blocs }: { blocs: Bloc[] }) {
  return blocs.map((b, i) =>
    b.type === "titre" ? (
      <h3 key={i}>{b.texte}</h3>
    ) : b.type === "liste" ? (
      <ul key={i}>
        {b.elements.map((e, j) => (
          <li key={j}>
            <EnLigne morceaux={e} />
          </li>
        ))}
      </ul>
    ) : (
      <p key={i}>
        <EnLigne morceaux={b.morceaux} />
      </p>
    ),
  );
}

/** Un article découpé en rubriques à chaque titre « ## », pour le sommaire. */
export function sectionsArticle(blocs: Bloc[]) {
  const debut: Bloc[] = [];
  const sections: { id: string; titre: string; blocs: Bloc[] }[] = [];
  for (const bloc of blocs) {
    if (bloc.type === "titre" && bloc.niveau === 2) {
      sections.push({ id: slugifier(bloc.texte), titre: bloc.texte, blocs: [] });
    } else {
      (sections.at(-1)?.blocs ?? debut).push(bloc);
    }
  }
  return { debut, sections };
}

export function TexteArticle({ debut, sections }: ReturnType<typeof sectionsArticle>) {
  return (
    <>
      {debut.length > 0 && (
        <div className="redaction pb-14">
          <Blocs blocs={debut} />
        </div>
      )}
      {sections.map((s) => (
        <Rubrique key={s.id} id={s.id} titre={s.titre}>
          <Blocs blocs={s.blocs} />
        </Rubrique>
      ))}
    </>
  );
}
