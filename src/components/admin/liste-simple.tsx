import Link from "next/link";

/** Liste de fiches du back-office : une ligne par fiche, toute la ligne mène à la modification. */
export function ListeSimple({
  lignes,
  vide,
}: {
  lignes: { href: string; titre: string; detail: string }[];
  vide: string;
}) {
  if (!lignes.length)
    return <p className="rounded-cadre bg-blanc p-6 text-sm text-graphite">{vide}</p>;
  return (
    <ul className="divide-y divide-filet rounded-cadre bg-blanc">
      {lignes.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="flex min-h-14 flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-3 hover:text-cadran"
          >
            <span className="font-medium">{l.titre}</span>
            <span className="text-sm text-graphite">{l.detail}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
