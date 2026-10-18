import type { ComponentProps } from "react";
import { classeSaisie } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Commun = { id: string; label: string; aide?: string; erreur?: string };

/** Aide et erreur reliées au champ, comme dans <Field>. */
function Message({ id, aide, erreur }: Pick<Commun, "id" | "aide" | "erreur">) {
  if (erreur)
    return (
      <p id={`${id}-erreur`} className="mt-2 text-sm text-bordeaux">
        {erreur}
      </p>
    );
  if (aide)
    return (
      <p id={`${id}-aide`} className="mt-2 text-sm text-graphite">
        {aide}
      </p>
    );
  return null;
}

function decrit({ id, aide, erreur }: Commun) {
  return {
    "aria-invalid": erreur ? true : undefined,
    "aria-describedby": erreur ? `${id}-erreur` : aide ? `${id}-aide` : undefined,
  } as const;
}

/** Liste déroulante native : le clavier et les lecteurs d'écran la connaissent déjà. */
export function ChampSelect({
  id,
  label,
  aide,
  erreur,
  options,
  className,
  ...props
}: Commun & ComponentProps<"select"> & { options: { valeur: string; libelle: string }[] }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className={cn(classeSaisie, "pr-10")}
        {...decrit({ id, label, aide, erreur })}
        {...props}
      >
        {options.map((o) => (
          <option key={o.valeur} value={o.valeur}>
            {o.libelle}
          </option>
        ))}
      </select>
      <Message id={id} aide={aide} erreur={erreur} />
    </div>
  );
}

export function ChampTexte({
  id,
  label,
  aide,
  erreur,
  className,
  ...props
}: Commun & ComponentProps<"textarea">) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        rows={4}
        className={cn(classeSaisie, "h-auto py-3 leading-relaxed")}
        {...decrit({ id, label, aide, erreur })}
        {...props}
      />
      <Message id={id} aide={aide} erreur={erreur} />
    </div>
  );
}

/** Groupe de champs titré, en section blanche. */
export function Bloc({
  titre,
  children,
  className,
}: {
  titre: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("rounded-cadre bg-blanc p-6 md:p-8", className)}>
      <legend className="float-left mb-6 w-full font-serif text-2xl">{titre}</legend>
      <div className="clear-left grid gap-6">{children}</div>
    </fieldset>
  );
}
