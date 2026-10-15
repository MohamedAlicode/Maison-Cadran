import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variantesBadge = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variante: {
        neutre: "bg-blanc text-encre ring-1 ring-filet",
        nouveau: "bg-encre text-acier",
        cadran: "bg-cadran/15 text-cadran",
        alerte: "bg-ambre/10 text-ambre",
        succes: "bg-sauge/10 text-sauge",
      },
    },
    defaultVariants: { variante: "neutre" },
  },
);

export function Badge({
  className,
  variante,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof variantesBadge>) {
  return <span className={cn(variantesBadge({ variante }), className)} {...props} />;
}
