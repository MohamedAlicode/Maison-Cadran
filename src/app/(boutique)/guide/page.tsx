import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageEditoriale, Reperes, Rubrique } from "@/components/editorial/page-editoriale";
import { TextLink } from "@/components/ui/text-link";
import { boutique } from "@/config/boutique";
import { indexCatalogue } from "@/lib/catalogue";
import {
  type ProduitIndexe,
  tranchesDiametre,
  tranchesEtancheite,
  tranchesPrix,
} from "@/lib/filtres";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Guide d'achat",
  description:
    "Budget, mouvement, taille du boîtier, étanchéité, verre, bracelet et entretien : les repères pour choisir sa première vraie montre.",
  alternates: { canonical: "/guide" },
};

const rubriques = [
  { id: "budget", titre: "Fixer son budget" },
  { id: "mouvement", titre: "Choisir son mouvement" },
  { id: "taille", titre: "Trouver la bonne taille" },
  { id: "etancheite", titre: "Lire l'étanchéité" },
  { id: "verre", titre: "Saphir ou minéral" },
  { id: "bracelet", titre: "Le bracelet" },
  { id: "entretien", titre: "L'entretien" },
];

/** Lien vers le catalogue filtré, avec le nombre de montres qui y correspondent. */
function LienFiltre({
  href,
  nombre,
  bloc = false,
  children,
}: {
  href: string;
  nombre: number;
  /** Sous le texte d'une explication : seul sur sa ligne, pour ne pas se fondre dans la phrase. */
  bloc?: boolean;
  children: ReactNode;
}) {
  if (nombre === 0) return null;
  return (
    <TextLink href={href} className={cn("chiffres", bloc && "mt-2 table")}>
      {children} ({nombre})
    </TextLink>
  );
}

/** Rangée de liens vers le catalogue, sans puces. */
function ListeLiens({ children }: { children: ReactNode }) {
  return <ul className="flex list-none flex-wrap space-y-0 gap-x-8 gap-y-4 pl-0">{children}</ul>;
}

export default async function PageGuide() {
  const produits = await indexCatalogue();
  const compter = (test: (p: ProduitIndexe) => boolean) => produits.filter(test).length;
  const dansTranche = (valeur: number, t: { min: number; max: number }) =>
    valeur >= t.min && valeur <= t.max;

  return (
    <PageEditoriale
      titre="Choisir sa première vraie montre"
      introduction={
        <p>
          Sept questions à se poser avant d&apos;acheter, dans l&apos;ordre où elles comptent.
          Chaque repère renvoie aux montres du catalogue qui y répondent.
        </p>
      }
      rubriques={rubriques}
    >
      <Rubrique {...rubriques[0]}>
        <p>
          Fixez un plafond avant de regarder. Entre 100 et 2 000 €, la différence se fait moins sur
          le nom de la marque que sur le mouvement, le verre et la finition du boîtier : les
          rubriques suivantes vous aident à savoir où mettre votre argent.
        </p>
        <ListeLiens>
          {tranchesPrix.map((t) => (
            <li key={t.cle}>
              <LienFiltre
                href={`/montres?prix=${t.cle}`}
                nombre={compter((p) => dansTranche(p.prixCentimes, t))}
              >
                {t.libelle}
              </LienFiltre>
            </li>
          ))}
        </ListeLiens>
      </Rubrique>

      <Rubrique {...rubriques[1]}>
        <p>
          C&apos;est le choix qui change le plus la vie avec la montre. Il y a deux grandes
          familles : le quartz, électronique, et la mécanique, qui bat grâce à un ressort.
        </p>
        <Reperes
          lignes={[
            {
              terme: "Quartz",
              detail: (
                <>
                  Le plus précis (quelques secondes d&apos;écart par mois) et le plus simple : une
                  pile à changer tous les deux à cinq ans.
                  <LienFiltre
                    bloc
                    href="/montres?mouvement=quartz"
                    nombre={compter((p) => p.mouvement === "QUARTZ")}
                  >
                    Les montres à quartz
                  </LienFiltre>
                </>
              ),
            },
            {
              terme: "Solaire",
              detail: (
                <>
                  Un quartz rechargé par la lumière, sans pile à changer.
                  <LienFiltre
                    bloc
                    href="/montres?mouvement=solaire"
                    nombre={compter((p) => p.mouvement === "SOLAIRE")}
                  >
                    Les montres solaires
                  </LienFiltre>
                </>
              ),
            },
            {
              terme: "Automatique",
              detail: (
                <>
                  Mécanique, remontée par les mouvements du poignet. Moins précise (quelques
                  secondes par jour), mais on la regarde vivre, et elle n&apos;a pas besoin de pile.
                  <LienFiltre
                    bloc
                    href="/montres?mouvement=automatique"
                    nombre={compter((p) => p.mouvement === "AUTOMATIQUE")}
                  >
                    Les automatiques
                  </LienFiltre>
                </>
              ),
            },
            {
              terme: "Remontage manuel",
              detail: (
                <>
                  Mécanique, remontée à la main par la couronne, souvent chaque jour.
                  <LienFiltre
                    bloc
                    href="/montres?mouvement=manuel"
                    nombre={compter((p) => p.mouvement === "MANUEL")}
                  >
                    Les montres à remontage manuel
                  </LienFiltre>
                </>
              ),
            },
          ]}
        />
        <p>
          Une automatique s&apos;arrête si on ne la porte pas pendant quelques jours : il suffit de
          la remonter et de la remettre à l&apos;heure. La durée qu&apos;elle tient au repos
          s&apos;appelle la réserve de marche, indiquée sur chaque fiche.
        </p>
      </Rubrique>

      <Rubrique {...rubriques[2]}>
        <p>
          Le diamètre est la mesure la plus citée, mais ce qui compte au poignet est la distance
          entre les cornes, d&apos;une attache du bracelet à l&apos;autre : elle ne doit pas
          dépasser la largeur du poignet. Mesurez votre tour de poignet avec un mètre ruban, puis
          servez-vous de ces repères, qui ne sont pas des règles.
        </p>
        <Reperes
          lignes={[
            {
              terme: "Moins de 16 cm",
              detail: "Un boîtier de 34 à 38 mm reste bien proportionné.",
            },
            { terme: "16 à 18 cm", detail: "De 38 à 41 mm, le cas le plus courant." },
            { terme: "Plus de 18 cm", detail: "À partir de 41 mm, sans que ce soit obligatoire." },
          ]}
        />
        <p>
          Pour porter la montre sous une manche de chemise, regardez aussi l&apos;épaisseur : sous
          12 mm, elle passe sans accrocher.
        </p>
        <ListeLiens>
          {tranchesDiametre.map((t) => (
            <li key={t.cle}>
              <LienFiltre
                href={`/montres?diametre=${t.cle}`}
                nombre={compter((p) => dansTranche(p.diametreMm, t))}
              >
                {t.libelle}
              </LienFiltre>
            </li>
          ))}
        </ListeLiens>
      </Rubrique>

      <Rubrique {...rubriques[3]}>
        <p>
          Les mètres indiqués sur le cadran correspondent à une pression d&apos;essai en
          laboratoire, pas à une profondeur de plongée. Une montre « 30 m » ne va pas sous
          l&apos;eau.
        </p>
        <Reperes
          lignes={[
            {
              terme: "30 m",
              detail: "Pluie et éclaboussures. Retirez-la pour vous laver les mains longuement.",
            },
            { terme: "50 m", detail: "Douche rapide, sans eau chaude ni savon sur le boîtier." },
            { terme: "100 m", detail: "Baignade et natation en surface." },
            { terme: "200 m et plus", detail: "Plongée avec masque et tuba, sports nautiques." },
          ]}
        />
        <p>
          Si la couronne se visse, vissez-la toujours avant d&apos;aller dans l&apos;eau. Évitez le
          sauna et le hammam : la chaleur fatigue les joints.
        </p>
        <ListeLiens>
          {tranchesEtancheite.map((t) => (
            <li key={t.cle}>
              <LienFiltre
                href={`/montres?etancheite=${t.cle}`}
                nombre={compter((p) => dansTranche(p.etancheiteM, t))}
              >
                {t.libelle}
              </LienFiltre>
            </li>
          ))}
        </ListeLiens>
      </Rubrique>

      <Rubrique {...rubriques[4]}>
        <Reperes
          lignes={[
            {
              terme: "Saphir",
              detail:
                "Presque impossible à rayer au quotidien. Plus cher, et il peut se fendre sous un choc violent.",
            },
            {
              terme: "Minéral",
              detail:
                "Moins cher et plus souple face aux chocs, mais il se raye plus facilement. Le Hardlex de Seiko est un verre minéral durci.",
            },
          ]}
        />
        <p>
          Pour une montre portée tous les jours, le saphir est le meilleur investissement : un verre
          rayé se remarque à chaque coup d&apos;œil.
        </p>
      </Rubrique>

      <Rubrique {...rubriques[5]}>
        <Reperes
          lignes={[
            {
              terme: "Acier",
              detail: (
                <>
                  Le plus durable, il supporte l&apos;eau. Il se règle en retirant des maillons.
                  <LienFiltre
                    bloc
                    href="/montres?bracelet=acier"
                    nombre={compter((p) => p.bracelet === "ACIER")}
                  >
                    Sur bracelet acier
                  </LienFiltre>
                </>
              ),
            },
            {
              terme: "Cuir",
              detail: (
                <>
                  Le plus habillé, et il se patine. Il craint l&apos;eau et la transpiration.
                  <LienFiltre
                    bloc
                    href="/montres?bracelet=cuir"
                    nombre={compter((p) => p.bracelet === "CUIR")}
                  >
                    Sur bracelet cuir
                  </LienFiltre>
                </>
              ),
            },
            {
              terme: "Caoutchouc",
              detail: (
                <>
                  Fait pour l&apos;eau et le sport, il se rince sous le robinet.
                  <LienFiltre
                    bloc
                    href="/montres?bracelet=caoutchouc"
                    nombre={compter((p) => p.bracelet === "CAOUTCHOUC")}
                  >
                    Sur bracelet caoutchouc
                  </LienFiltre>
                </>
              ),
            },
            {
              terme: "Tissu (NATO)",
              detail: "Léger et bon marché, il se change en quelques secondes.",
            },
          ]}
        />
        <p>
          Le bracelet est la pièce la plus facile à changer : choisissez d&apos;abord la montre, le
          bracelet suivra.
        </p>
      </Rubrique>

      <Rubrique {...rubriques[6]}>
        <ul>
          <li>
            <strong>Mécanique :</strong> une révision par un horloger tous les cinq à dix ans selon
            les marques. Tenez-la éloignée des aimants puissants (enceintes, fermoirs de sacs), qui
            peuvent la faire avancer.
          </li>
          <li>
            <strong>Quartz :</strong> faites changer la pile chez un horloger, qui contrôle aussi
            l&apos;étanchéité.
          </li>
          <li>
            <strong>Au quotidien :</strong> un chiffon doux suffit. Un bracelet acier se nettoie à
            l&apos;eau tiède avec une brosse souple, si la montre est étanche.
          </li>
        </ul>
        <p>
          Votre montre est couverte par notre garantie de {boutique.garantieMois / 12} ans.{" "}
          <Link href="/faq#garantie">En savoir plus</Link>.
        </p>
      </Rubrique>
    </PageEditoriale>
  );
}
