"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Case à cocher carrée (filtres du catalogue, consentements). */
export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "grid size-4.5 shrink-0 place-items-center rounded-xs border border-filet-fort bg-blanc",
        "transition-colors duration-(--duree-courte) data-[state=checked]:border-encre data-[state=checked]:bg-encre",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-3 text-acier" strokeWidth={2.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
