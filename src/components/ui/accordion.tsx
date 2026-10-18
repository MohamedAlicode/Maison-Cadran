"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Accordéon accessible (Radix) : panneaux de filtres, FAQ, rubriques techniques.
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-filet", className)} {...props} />;
}

/** `niveau` : le titre doit suivre ceux de la page (un h2 juste sous le h1 d'une fiche). */
export function AccordionTrigger({
  className,
  children,
  niveau = 3,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger> & { niveau?: 2 | 3 }) {
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <AccordionPrimitive.Header asChild>
      <Titre>
        <AccordionPrimitive.Trigger
          className={cn(
            "group flex w-full items-center justify-between py-5 text-left font-sans text-sm font-medium",
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDown
            aria-hidden
            className="size-4 shrink-0 text-cadran transition-transform duration-(--duree-moyenne) ease-maison group-data-[state=open]:rotate-180"
            strokeWidth={1.5}
          />
        </AccordionPrimitive.Trigger>
      </Titre>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content className="overflow-hidden" {...props}>
      <div className={cn("pb-5 text-sm leading-relaxed text-graphite", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
