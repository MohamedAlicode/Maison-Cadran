import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Titre de page du back-office, avec son action principale à droite. */
export function EnTeteAdmin({
  titre,
  action,
  children,
}: {
  titre: string;
  action?: { href: string; libelle: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-4xl md:text-5xl">{titre}</h1>
        {children}
      </div>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.libelle}</Link>
        </Button>
      )}
    </div>
  );
}

/** Confirmation après un enregistrement (paramètre ?enregistre=1 posé par l'action). */
export function Confirmation({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <p role="status" className="mb-6 text-sm text-sauge empty:hidden">
      {visible ? children : null}
    </p>
  );
}
