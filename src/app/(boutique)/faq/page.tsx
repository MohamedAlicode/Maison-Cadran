import type { Metadata } from "next";
import Link from "next/link";
import { PageEditoriale, Rubrique } from "@/components/editorial/page-editoriale";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { boutique } from "@/config/boutique";
import { formatPrix, formatPrixCourt } from "@/lib/prix";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: `Paiement, livraison, retours, garantie : les réponses aux questions que l'on se pose avant d'acheter une montre chez ${boutique.nom}.`,
  alternates: { canonical: "/faq" },
};

const { livraison, retours, garantieMois, contact } = boutique;
const seuil = formatPrixCourt(livraison.seuilGratuitCentimes);

type Question = { question: string; reponse: string; lien?: { href: string; libelle: string } };

// Les réponses restent du texte simple : elles alimentent aussi les données structurées FAQPage.
const rubriques: { id: string; titre: string; questions: Question[] }[] = [
  {
    id: "commande",
    titre: "Commande et paiement",
    questions: [
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        reponse:
          "La carte bancaire (CB, Visa, Mastercard), par un paiement sécurisé. Nous ne voyons ni ne conservons jamais votre numéro de carte.",
      },
      {
        question: "Puis-je payer en plusieurs fois ?",
        reponse:
          "Oui, en 3 ou 4 fois avec Klarna, au moment du paiement. Klarna vous indique l'échéancier avant que vous validiez.",
      },
      {
        question: "Les prix affichés sont-ils définitifs ?",
        reponse:
          "Ils sont en euros, toutes taxes comprises (TVA à 20 % incluse). Seuls les frais de livraison peuvent s'ajouter, et ils sont indiqués avant le paiement.",
      },
    ],
  },
  {
    id: "livraison",
    titre: "Livraison",
    questions: [
      {
        question: "Combien coûte la livraison ?",
        reponse: `Elle est offerte dès ${seuil} d'achat. En dessous, elle coûte ${formatPrix(livraison.fraisCentimes)}.`,
      },
      {
        question: "Comment ma montre est-elle livrée ?",
        reponse: `Par ${livraison.transporteur} : le colis n'est jamais laissé dans une boîte aux lettres. Comptez ${livraison.delaiLivraison}.`,
      },
      {
        question: "Livrez-vous hors de France ?",
        reponse: "Pas encore : nous livrons uniquement en France métropolitaine.",
      },
    ],
  },
  {
    id: "retours",
    titre: "Retours",
    questions: [
      {
        question: "Puis-je renvoyer une montre qui ne me plaît pas ?",
        reponse: `Oui, pendant ${retours.joursRetractation} jours après réception, sans avoir à vous justifier. Le retour est gratuit : les frais d'envoi sont à notre charge.`,
        lien: { href: "/retours", libelle: "La marche à suivre" },
      },
      {
        question: "Puis-je essayer la montre avant de décider ?",
        reponse:
          "Bien sûr : sortez-la de son écrin et mettez-la au poignet pour juger de sa taille. Laissez simplement les films de protection et les scellés en place, pour qu'elle puisse être retournée neuve.",
      },
    ],
  },
  {
    id: "garantie",
    titre: "Garantie et authenticité",
    questions: [
      {
        question: "Les montres sont-elles neuves ?",
        reponse:
          "Toujours. Nous ne vendons ni occasion ni reconditionné : chaque montre est neuve et n'a jamais été vendue auparavant.",
      },
      {
        question: "Quelle est la garantie ?",
        reponse: `Chaque montre est garantie ${garantieMois / 12} ans à compter de la livraison. Vous bénéficiez aussi des garanties légales de conformité et des vices cachés, détaillées dans nos conditions générales de vente.`,
      },
      {
        question: "Comment faire jouer la garantie ?",
        reponse: `Écrivez-nous à ${contact.email} avec votre numéro de commande et une description du problème. Nous vous indiquons la marche à suivre.`,
      },
    ],
  },
  {
    id: "choisir",
    titre: "Choisir sa montre",
    questions: [
      {
        question: "Quelle taille de boîtier choisir ?",
        reponse:
          "Cela dépend de votre poignet et de l'effet recherché. Notre guide d'achat donne des repères simples, avec le tour de poignet et le diamètre qui vont ensemble.",
        lien: { href: "/guide#taille", libelle: "Lire le guide" },
      },
      {
        question: "Automatique ou quartz ?",
        reponse:
          "Le quartz est le plus précis et le plus simple à vivre. L'automatique se remonte en la portant, sans pile, et fait battre une vraie mécanique. Le guide d'achat détaille les quatre familles de mouvements.",
        lien: { href: "/guide#mouvement", libelle: "Comparer les mouvements" },
      },
    ],
  },
];

export default function PageFaq() {
  const donnees = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: rubriques.flatMap((r) =>
      r.questions.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.reponse },
      })),
    ),
  };

  return (
    <PageEditoriale
      titre="Questions fréquentes"
      introduction={
        <p>
          Les réponses aux questions que l&apos;on se pose avant un premier achat. Vous ne trouvez
          pas la vôtre ?{" "}
          <Link href="/contact" className="text-cadran underline underline-offset-4">
            Écrivez-nous
          </Link>
          .
        </p>
      }
      rubriques={rubriques}
    >
      {rubriques.map((r) => (
        <Rubrique key={r.id} id={r.id} titre={r.titre}>
          <Accordion type="multiple" className="border-t border-filet">
            {r.questions.map((q) => (
              <AccordionItem key={q.question} value={q.question}>
                <AccordionTrigger className="gap-6 text-base">{q.question}</AccordionTrigger>
                <AccordionContent className="text-base">
                  <p>{q.reponse}</p>
                  {q.lien && (
                    <p className="mt-3">
                      <Link href={q.lien.href}>{q.lien.libelle}</Link>
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Rubrique>
      ))}
      <JsonLd donnees={donnees} />
    </PageEditoriale>
  );
}
