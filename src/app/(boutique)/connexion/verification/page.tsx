import { MailCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Vérifiez votre boîte mail",
  robots: { index: false },
};

export default function PageVerification() {
  return (
    <Container className="py-12 md:py-20">
      <div className="mx-auto max-w-md">
        <MailCheck aria-hidden className="size-8 text-cadran" strokeWidth={1.5} />
        <h1 className="mt-4 text-4xl md:text-5xl">Vérifiez votre boîte mail</h1>
        <p className="mt-4 leading-relaxed text-graphite">
          Nous venons de vous envoyer un lien de connexion. Ouvrez-le sur cet appareil : il
          fonctionne une seule fois, pendant 24 heures.
        </p>
        <p className="mt-4 leading-relaxed text-graphite">
          Rien reçu après quelques minutes ? Regardez dans les indésirables, ou{" "}
          <Link
            href="/connexion"
            className="text-encre underline decoration-filet-fort underline-offset-4 hover:text-cadran"
          >
            demandez un nouveau lien
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
