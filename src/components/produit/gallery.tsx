"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type ImageGalerie = { url: string; alt: string };

/**
 * Galerie de la fiche produit.
 * Desktop : vignettes verticales, zoom loupe au survol, plein écran au clic.
 * Mobile : défilement horizontal au doigt avec points de position, plein écran au toucher.
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

  if (images.length === 0) return <div className="aspect-square bg-blanc" />;

  function allerA(index: number) {
    const i = (index + images.length) % images.length;
    setActive(i);
    defileur.current?.scrollTo({ left: i * defileur.current.clientWidth, behavior: "smooth" });
  }

  function suivreSouris(e: MouseEvent<HTMLButtonElement>) {
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
                i === active ? "ring-encre" : "ring-sable hover:ring-sable-fonce",
              )}
            >
              <Image src={image.url} alt="" fill sizes="72px" className="object-contain p-1.5" />
            </button>
          </li>
        ))}
      </ul>

      {/* Image principale (desktop) avec loupe */}
      <div className="relative hidden lg:block">
        <button
          type="button"
          onClick={() => setPleinEcran(true)}
          onMouseMove={suivreSouris}
          onMouseLeave={() => setZoom(null)}
          aria-label="Agrandir l'image"
          className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-blanc"
        >
          <Image
            src={images[active].url}
            alt={images[active].alt}
            fill
            priority={priorite}
            sizes="(min-width: 1280px) 600px, 50vw"
            className="object-contain p-[8%] transition-transform duration-200 ease-out"
            style={
              zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined
            }
          />
        </button>
        <span className="pointer-events-none mt-3 flex items-center justify-end gap-2 text-xs text-graphite">
          <Expand aria-hidden className="size-3.5" strokeWidth={1.5} /> Survolez pour zoomer,
          cliquez pour agrandir
        </span>
      </div>

      {/* Carrousel (mobile et tablette) */}
      <div className="lg:hidden">
        <div
          ref={defileur}
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => {
                setActive(i);
                setPleinEcran(true);
              }}
              aria-label={`Agrandir : ${image.alt}`}
              className="relative aspect-square w-full shrink-0 snap-center bg-blanc"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                priority={priorite && i === 0}
                sizes="100vw"
                className="object-contain p-[8%]"
              />
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2" aria-hidden>
            {images.map((image, i) => (
              <span
                key={image.url}
                className={cn(
                  "h-0.5 w-6 transition-colors",
                  i === active ? "bg-encre" : "bg-sable",
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
            onKeyDown={clavier}
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
                className="grid size-11 place-items-center rounded-xs hover:bg-sable/40"
                aria-label="Fermer"
              >
                <X className="size-5" strokeWidth={1.5} />
              </DialogPrimitive.Close>
            </div>
            <div className="relative flex-1">
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
                    aria-label="Vue précédente"
                    className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-xs bg-ivoire/80 hover:bg-ivoire md:left-8"
                  >
                    <ChevronLeft className="size-6" strokeWidth={1.25} />
                  </button>
                  <button
                    type="button"
                    onClick={() => allerA(active + 1)}
                    aria-label="Vue suivante"
                    className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-xs bg-ivoire/80 hover:bg-ivoire md:right-8"
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
