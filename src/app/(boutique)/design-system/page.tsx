import type { Metadata } from "next";
import { GrilleProduits } from "@/components/catalogue/product-card";
import { ReassuranceBar } from "@/components/layout/reassurance-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Price } from "@/components/ui/price";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import { indexCatalogue } from "@/lib/catalogue";
import { DemoMiniPanier } from "./demo-mini-panier";

// Page interne de référence du design system. Non indexée par les moteurs de recherche.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const couleurs = [
  { nom: "Crème", token: "creme", valeur: "#F7F3EC", usage: "Fond de page" },
  { nom: "Ivoire", token: "ivoire", valeur: "#FFFDF9", usage: "Surfaces, champs" },
  { nom: "Blanc", token: "blanc", valeur: "#FFFFFF", usage: "Fond des photos" },
  { nom: "Sable", token: "sable", valeur: "#E4DDD1", usage: "Bordures, filets" },
  { nom: "Graphite", token: "graphite", valeur: "#5E5A53", usage: "Texte secondaire" },
  { nom: "Encre", token: "encre", valeur: "#1C1B19", usage: "Texte, boutons" },
  { nom: "Nuit", token: "nuit", valeur: "#14161A", usage: "Sections sombres" },
  { nom: "Laiton", token: "laiton", valeur: "#B08D57", usage: "Accent décoratif" },
  {
    nom: "Laiton foncé",
    token: "laiton-fonce",
    valeur: "#7A5C26",
    usage: "Liens, petit texte doré",
  },
  { nom: "Sauge", token: "sauge", valeur: "#3E6B4F", usage: "En stock, succès" },
  { nom: "Ambre", token: "ambre", valeur: "#9A5B13", usage: "Stock faible" },
  { nom: "Bordeaux", token: "bordeaux", valeur: "#9B2C2C", usage: "Erreurs" },
];

// Classes écrites en entier pour que Tailwind les détecte.
const fonds: Record<string, string> = {
  creme: "bg-creme",
  ivoire: "bg-ivoire",
  blanc: "bg-blanc",
  sable: "bg-sable",
  graphite: "bg-graphite",
  encre: "bg-encre",
  nuit: "bg-nuit",
  laiton: "bg-laiton",
  "laiton-fonce": "bg-laiton-fonce",
  sauge: "bg-sauge",
  ambre: "bg-ambre",
  bordeaux: "bg-bordeaux",
};

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-sable py-14">
      <h2 className="mb-8 text-3xl">{titre}</h2>
      {children}
    </section>
  );
}

export default async function DesignSystem() {
  const exemples = (await indexCatalogue()).slice(0, 4);
  return (
    <Container className="py-16">
      <SectionHeading
        as="h1"
        surtitre="Référence interne"
        titre="Design system"
        description="Couleurs, typographies et composants de la boutique. Toute nouvelle interface part de ces briques."
      />

      <Bloc titre="Couleurs">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {couleurs.map((c) => (
            <li key={c.token}>
              <div className={`aspect-[4/3] rounded-xs ring-1 ring-sable ${fonds[c.token]}`} />
              <p className="mt-3 text-sm font-medium">{c.nom}</p>
              <p className="chiffres text-xs text-graphite">{c.valeur}</p>
              <p className="text-xs text-graphite">{c.usage}</p>
            </li>
          ))}
        </ul>
      </Bloc>

      <Bloc titre="Typographies">
        <div className="space-y-6">
          <div>
            <Eyebrow>Titres : Cormorant Garamond</Eyebrow>
            <p className="mt-2 font-serif text-6xl leading-none">Le temps, bien choisi</p>
            <p className="mt-2 font-serif text-4xl leading-tight">
              Hamilton Khaki Field Mechanical
            </p>
            <p className="mt-2 font-serif text-2xl italic">Un classique militaire depuis 1940</p>
          </div>
          <div className="max-w-2xl">
            <Eyebrow>Texte : Inter</Eyebrow>
            <p className="mt-2 leading-relaxed">
              Le calibre H-50 offre une réserve de marche de 80 heures. Son boîtier en acier de 38
              mm, étanche à 50 mètres, accueille un verre saphir traité antireflet.
            </p>
            <p className="chiffres mt-2 text-sm text-graphite">
              Chiffres tabulaires : 595 € · 38 mm · 80 h
            </p>
          </div>
        </div>
      </Bloc>

      <Bloc titre="Boutons et liens">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Ajouter au panier</Button>
          <Button variante="secondaire">Voir les détails</Button>
          <Button variante="fantome">Annuler</Button>
          <Button taille="sm">Petit</Button>
          <Button disabled>Indisponible</Button>
          <TextLink href="/montres">Lien texte</TextLink>
        </div>
        <div className="mt-6 inline-flex flex-wrap gap-4 bg-nuit p-6">
          <Button variante="clair">Sur fond sombre</Button>
        </div>
      </Bloc>

      <Bloc titre="Badges et prix">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variante="nouveau">Nouveau</Badge>
          <Badge variante="alerte">Dernière pièce</Badge>
          <Badge variante="succes">En stock</Badge>
          <Badge variante="laiton">Édition limitée</Badge>
          <Badge>Automatique</Badge>
        </div>
        <div className="mt-6 flex flex-wrap gap-10 text-lg">
          <Price centimes={72_500} />
          <Price centimes={36_900} barreCentimes={39_900} />
        </div>
      </Bloc>

      <Bloc titre="Formulaires">
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <Field
            id="ds-email"
            label="Adresse email"
            type="email"
            placeholder="vous@exemple.fr"
            aide="Pour suivre votre commande."
          />
          <Field
            id="ds-cp"
            label="Code postal"
            defaultValue="7500"
            erreur="Le code postal doit contenir 5 chiffres."
          />
        </div>
        <div className="mt-6 space-y-3">
          {["Automatique", "Quartz", "Solaire"].map((mouvement, i) => (
            <div key={mouvement} className="flex items-center gap-3">
              <Checkbox id={`ds-${mouvement}`} defaultChecked={i === 0} />
              <Label htmlFor={`ds-${mouvement}`} className="mb-0 font-normal">
                {mouvement} <span className="text-graphite">({[24, 12, 6][i]})</span>
              </Label>
            </div>
          ))}
        </div>
      </Bloc>

      <Bloc titre="Accordéon">
        <Accordion type="single" collapsible className="max-w-2xl border-t border-sable">
          <AccordionItem value="livraison">
            <AccordionTrigger>Livraison et retours</AccordionTrigger>
            <AccordionContent>
              Expédition sous 48 h en Colissimo assuré, remise contre signature. Retours gratuits
              sous 14 jours.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="authenticite">
            <AccordionTrigger>Authenticité</AccordionTrigger>
            <AccordionContent>
              Chaque montre est neuve, vérifiée et livrée avec son écrin et ses documents
              d&apos;origine.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Bloc>

      <Bloc titre="Mini-panier">
        <DemoMiniPanier />
      </Bloc>

      <Bloc titre="Cartes produit">
        <GrilleProduits produits={exemples} />
      </Bloc>

      <Bloc titre="Réassurance">
        <ReassuranceBar />
      </Bloc>
    </Container>
  );
}
