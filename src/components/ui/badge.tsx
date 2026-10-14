import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variantesBadge = cva(
  "inline-flex items-center gap-1.5 rounded-xs px-2 py-1 text-[11px] font-medium tracking-surtitre uppercase",
  {
    variants: {
      variante: {
        neutre: "bg-ivoire text-encre ring-1 ring-sable",
        nouveau: "bg-encre text-creme",
        laiton: "bg-laiton/15 text-laiton-fonce",
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
