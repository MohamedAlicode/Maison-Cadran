"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type ImageGalerie = { url: string; alt: string };

/**
 * Galerie de la fiche produit.
 * Les photos défilent de gauche à droite (doigt, trackpad, flèches, clavier) à toutes les tailles.
 * Desktop : vignettes verticales et loupe au survol. Plein écran au clic ou au toucher.
 */
export function Gallery({
  images,
  priorite = true,
}: {
  images: ImageGalerie[];
  priorite?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [pleinEcran, setPleinEcran] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const defileur = useRef<HTMLDivElement>(null);
  const departDoigt = useRef(0);
  const photos = useRef<(HTMLButtonElement | null)[]>([]);

  if (images.length === 0) return <div className="aspect-square bg-blanc" />;

  function allerA(index: number) {
    // Pas de retour au début après la dernière photo : les flèches s'effacent aux extrémités.
    const i = Math.min(Math.max(index, 0), images.length - 1);
    setActive(i);
    // Au clavier, le focus suit la photo affichée au lieu de rester sur celle qui sort de l'écran.
    if (photos.current.includes(document.activeElement as HTMLButtonElement)) {
      photos.current[i]?.focus({ preventScroll: true });
    }
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    defileur.current?.scrollTo({
      left: i * defileur.current.clientWidth,
      behavior: reduit ? "auto" : "smooth",
    });
  }

  function suivreSouris(e: MouseEvent<HTMLButtonElement>) {
    // La loupe ne sert qu'à la souris, sur grand écran : sur tablette, le doigt fait défiler.
    if (!window.matchMedia("(min-width: 1024px) and (hover: hover)").matches) return;
    const zone = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - zone.left) / zone.width) * 100,
      y: ((e.clientY - zone.top) / zone.height) * 100,
    });
  }

  function clavier(e: KeyboardEvent) {
    if (e.key === "ArrowRight") allerA(active + 1);
    if (e.key === "ArrowLeft") allerA(active - 1);
  }

  return (
    <div className="lg:grid lg:grid-cols-[72px_1fr] lg:gap-4 lg:self-start" onKeyDown={clavier}>
      {/* Vignettes (desktop) */}
      <ul className="hidden flex-col gap-3 lg:flex" aria-label="Choisir une vue">
        {images.map((image, i) => (
          <li key={image.url}>
            <button
              type="button"
              onClick={() => allerA(i)}
              aria-label={`Afficher : ${image.alt}`}
              aria-current={i === active}
              className={cn(
                "relative block aspect-square w-full bg-blanc ring-1 transition",
                i === active ? "ring-encre" : "ring-filet hover:ring-filet-fort",
              )}
            >
              <Image src={image.url} alt="" fill sizes="72px" className="object-contain p-1.5" />
            </button>
          </li>
        ))}
      </ul>

      {/* Photos : défilement au doigt ou au trackpad à toutes les tailles, flèches dès 768 px */}
      <div className="min-w-0">
        <div
          role="region"
          aria-roledescription="carrousel"
          aria-label="Photos de la montre"
          className="group/galerie relative"
        >
          <div
            ref={defileur}
            onScroll={(e) => {
              const el = e.currentTarget;
              setActive(Math.round(el.scrollLeft / el.clientWidth));
            }}
            className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
          >
            {images.map((image, i) => (
              <button
                key={image.url}
                ref={(el) => {
                  photos.current[i] = el;
                }}
                type="button"
                aria-label={`${i + 1} sur ${images.length} : ${image.alt}. Agrandir`}
                onClick={() => {
                  setActive(i);
                  setPleinEcran(true);
                }}
                onMouseMove={suivreSouris}
                onMouseLeave={() => setZoom(null)}
                className="relative aspect-square w-full shrink-0 snap-center overflow-hidden bg-blanc lg:cursor-zoom-in"
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  priority={priorite && i === 0}
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-(--marge-photo) transition-transform duration-(--duree-courte) ease-maison"
                  style={
                    zoom && i === active
                      ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <BoutonVue
                sens="precedent"
                onClick={() => allerA(active - 1)}
                disabled={active === 0}
              />
              <BoutonVue
                sens="suivant"
                onClick={() => allerA(active + 1)}
                disabled={active === images.length - 1}
              />
              <span
                aria-live="polite"
                className="chiffres pointer-events-none absolute bottom-3 left-3 rounded-xs bg-acier/85 px-2 py-1 text-xs text-encre backdrop-blur-verre transparence-reduite:bg-acier"
              >
                {active + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        <p className="mt-3 hidden items-center justify-end gap-2 text-xs text-graphite lg:flex">
          <Expand aria-hidden className="size-3.5" strokeWidth={1.5} /> Survolez pour zoomer,
          cliquez pour agrandir
        </p>
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2 lg:hidden" aria-hidden>
            {images.map((image, i) => (
              <span
                key={image.url}
                className={cn(
                  "h-0.5 w-6 transition-colors duration-(--duree-courte)",
                  i === active ? "bg-encre" : "bg-filet",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Plein écran */}
      <DialogPrimitive.Root open={pleinEcran} onOpenChange={setPleinEcran}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex flex-col bg-blanc data-[state=open]:animate-fondu"
            onCloseAutoFocus={(e) => {
              // La photo n'est pas un Dialog.Trigger : sans ceci, le focus retomberait en haut de page.
              e.preventDefault();
              photos.current[active]?.focus({ preventScroll: true });
            }}
          >
            <DialogPrimitive.Title className="sr-only">{images[active].alt}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Utilisez les flèches pour changer de vue.
            </DialogPrimitive.Description>
            <div className="flex items-center justify-between px-4 py-3 md:px-8">
              <span className="chiffres text-sm text-graphite">
                {active + 1} / {images.length}
              </span>
              <DialogPrimitive.Close
                className="grid size-11 place-items-center rounded-xs hover:bg-filet/40"
                aria-label="Fermer"
              >
                <X className="size-5" strokeWidth={1.5} />
              </DialogPrimitive.Close>
            </div>
            <div
              className="relative flex-1 touch-pan-y"
              onTouchStart={(e) => (departDoigt.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const ecart = e.changedTouches[0].clientX - departDoigt.current;
                // Au-delà de 48 px, le geste est un balayage et non un simple toucher.
                if (Math.abs(ecart) > 48) allerA(active + (ecart < 0 ? 1 : -1));
              }}
            >
              <Image
                src={images[active].url}
                alt={images[active].alt}
                fill
                sizes="100vw"
                className="object-contain p-4 md:p-12"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => allerA(active - 1)}
                    disabled={active === 0}
                    aria-label="Vue précédente"
                    className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-xs bg-blanc/80 hover:bg-blanc disabled:pointer-events-none disabled:opacity-0 md:left-8"
                  >
                    <ChevronLeft className="size-6" strokeWidth={1.25} />
                  </button>
                  <button
                    type="button"
                    onClick={() => allerA(active + 1)}
                    disabled={active === images.length - 1}
                    aria-label="Vue suivante"
                    className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-xs bg-blanc/80 hover:bg-blanc disabled:pointer-events-none disabled:opacity-0 md:right-8"
                  >
                    <ChevronRight className="size-6" strokeWidth={1.25} />
                  </button>
                </>
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}

/** Flèche posée sur la photo, en verre utile (fond acier à 85 %). */
function BoutonVue({
  sens,
  onClick,
  disabled,
}: {
  sens: "precedent" | "suivant";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icone = sens === "precedent" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={sens === "precedent" ? "Photo précédente" : "Photo suivante"}
      className={cn(
        "absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-xs bg-acier/85 text-encre backdrop-blur-verre transition-opacity duration-(--duree-courte) ease-maison md:grid transparence-reduite:bg-acier",
        "hover:bg-acier disabled:pointer-events-none disabled:opacity-0",
        sens === "precedent" ? "left-3" : "right-3",
      )}
    >
      <Icone aria-hidden className="size-5" strokeWidth={1.5} />
    </button>
  );
}
