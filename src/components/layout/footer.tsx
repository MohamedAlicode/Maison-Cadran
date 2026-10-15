import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { boutique } from "@/config/boutique";

const colonnes = [
  {
    titre: "Boutique",
    liens: [
      { libelle: "Toutes les montres", href: "/montres" },
      { libelle: "Marques", href: "/marques" },
      { libelle: "Guide d'achat", href: "/guide" },
    ],
  },
  {
    titre: "Service client",
    liens: [
      { libelle: "Contact", href: "/contact" },
      { libelle: "FAQ", href: "/faq" },
      { libelle: "Retours et rétractation", href: "/retours" },
    ],
  },
  {
    titre: "Informations",
    liens: [
      { libelle: "Conditions générales de vente", href: "/cgv" },
      { libelle: "Mentions légales", href: "/mentions-legales" },
      { libelle: "Confidentialité", href: "/confidentialite" },
      { libelle: "Cookies", href: "/cookies" },
    ],
  },
] as const;

/** Année du copyright, mise en cache (une date ne peut pas être calculée pendant le prérendu). */
async function AnneeCourante() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** Pied de page sombre : coordonnées du service client et liens utiles. */
export function Footer() {
  return (
    <footer className="mt-auto bg-nuit text-acier">
      <div className="mx-auto grid max-w-site gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-5 lg:px-12 lg:py-20">
        <div className="lg:col-span-2">
          <Logo clair className="items-start" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-acier/70">{boutique.slogan}.</p>
          <div className="mt-8 text-sm text-acier/80">
            <p className="font-medium text-cadran-clair">Une question ?</p>
            <p className="mt-3">
              <a
                href={`mailto:${boutique.contact.email}`}
                className="transition-colors hover:text-acier"
              >
                {boutique.contact.email}
              </a>
            </p>
            <p className="mt-1">
              <a
                href={`tel:${boutique.contact.telephone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-acier"
              >
                {boutique.contact.telephone}
              </a>
              , {boutique.contact.horaires}
            </p>
          </div>
        </div>
        {colonnes.map((colonne) => (
          <nav key={colonne.titre} aria-label={colonne.titre}>
            <h2 className="font-sans text-sm font-medium text-cadran-clair">{colonne.titre}</h2>
            <ul className="mt-3.5 text-sm text-acier/80">
              {colonne.liens.map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    className="inline-block py-1.5 transition-colors hover:text-acier"
                  >
                    {lien.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-acier/10">
        <p className="mx-auto max-w-site px-6 py-6 text-xs text-acier/60 lg:px-12">
          © <AnneeCourante /> {boutique.nom}. Prix TTC, TVA 20 % incluse. Paiement sécurisé.
        </p>
      </div>
    </footer>
  );
}
