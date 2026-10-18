"use client";

import { useActionState, useState } from "react";
import { Bloc } from "@/components/admin/champs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import type { OrderStatus } from "@/generated/prisma/enums";
import type { EtatFormulaireAdmin } from "@/lib/admin/regles";
import { avancerCommande, rembourserCommande } from "@/server/actions/admin-commandes";

const libellesEtape: Partial<Record<OrderStatus, string>> = {
  PREPARING: "Passer en préparation",
  SHIPPED: "Marquer expédiée",
  DELIVERED: "Marquer livrée",
};

function Message({ etat }: { etat: EtatFormulaireAdmin }) {
  return (
    <p role="status" className="text-sm text-bordeaux empty:hidden">
      {etat?.message}
    </p>
  );
}

/** Étape suivante : un bouton, et pour l'expédition les informations de suivi du colis. */
export function AvancerCommande({
  numero,
  depuis,
  vers,
}: {
  numero: string;
  depuis: OrderStatus;
  vers: OrderStatus;
}) {
  const [etat, action, enCours] = useActionState(avancerCommande, null);
  const champ = (nom: string) => ({
    id: `suivi-${nom}`,
    name: nom,
    defaultValue: etat?.valeurs?.[nom],
    erreur: etat?.erreurs?.[nom],
  });
  return (
    <form action={action}>
      <Bloc titre="Étape suivante">
        <input type="hidden" name="numero" value={numero} />
        <input type="hidden" name="depuis" value={depuis} />
        {vers === "SHIPPED" && (
          <>
            <Field
              {...champ("transporteur")}
              defaultValue={etat?.valeurs?.transporteur ?? "Colissimo"}
              label="Transporteur"
              required
            />
            <Field {...champ("numeroSuivi")} label="Numéro de suivi" required />
            <Field
              {...champ("lienSuivi")}
              label="Lien de suivi (facultatif)"
              type="url"
              aide="Le client le reçoit par e-mail et le retrouve dans son compte."
            />
          </>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={enCours}>
            {libellesEtape[vers]}
          </Button>
          <Message etat={etat} />
        </div>
      </Bloc>
    </form>
  );
}

/** Remboursement en deux temps : il part chez Stripe et ne s'annule pas. */
export function RembourserCommande({
  numero,
  montant,
  stockSorti,
}: {
  numero: string;
  montant: string;
  stockSorti: boolean;
}) {
  const [etat, action, enCours] = useActionState(rembourserCommande, null);
  const [aConfirmer, setAConfirmer] = useState(false);
  return (
    <form action={action}>
      <Bloc titre="Remboursement">
        <input type="hidden" name="numero" value={numero} />
        <p className="-mt-2 text-sm text-graphite">
          Remboursement intégral de {montant} sur le moyen de paiement du client. Il ne peut pas
          être annulé.
        </p>
        {stockSorti && (
          <div className="flex items-center gap-3">
            <Checkbox id="restock" name="restock" defaultChecked />
            <Label htmlFor="restock" className="mb-0 font-normal">
              Remettre les montres en stock
            </Label>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {aConfirmer ? (
            <>
              <Button type="submit" variante="secondaire" disabled={enCours}>
                Oui, rembourser {montant}
              </Button>
              <Button type="button" variante="fantome" onClick={() => setAConfirmer(false)}>
                Annuler
              </Button>
            </>
          ) : (
            <Button type="button" variante="secondaire" onClick={() => setAConfirmer(true)}>
              Rembourser
            </Button>
          )}
          <Message etat={etat} />
        </div>
      </Bloc>
    </form>
  );
}
