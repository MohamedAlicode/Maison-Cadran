import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { listeMarques } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Nos marques",
  description:
    "Tissot, Hamilton, Seiko, Citizen, Orient, Certina, Mido, Frederique Constant : découvrez les maisons horlogères que nous sélectionnons.",
  alternates: { canonical: "/marques" },
};

export default async function PageMarques() {
  const marques = await listeMarques();
  return (
    <Container className="py-10 md:py-14">
      <Breadcrumb miettes={[{ libelle: "Accueil", href: "/" }, { libelle: "Marques" }]} />
      <SectionHeading
        as="h1"
        className="mt-6"
        surtitre={`${marques.length} maisons`}
        titre="Nos marques"
        description="Des manufactures suisses et japonaises choisies pour la qualité de leurs mouvements et le sérieux de leur service après-vente."
      />
      <ul className="mt-14 grid gap-px bg-filet sm:grid-cols-2 lg:grid-cols-4">
        {marques.map((marque) => (
          <li key={marque.id} className="bg-acier">
            <Link
              href={`/marques/${marque.slug}`}
              className="group flex h-full flex-col p-6 transition-colors hover:bg-blanc md:p-8"
            >
              <span className="text-xs font-medium tracking-surtitre text-graphite uppercase">
                {marque.country} · depuis {marque.foundedYear}
              </span>
              <h2 className="mt-3 text-3xl transition-colors group-hover:text-cadran">
                {marque.name}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">
                {marque.description}
              </p>
              <span className="chiffres mt-6 text-sm text-encre">
                {marque.nombreMontres} montre{marque.nombreMontres > 1 ? "s" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
