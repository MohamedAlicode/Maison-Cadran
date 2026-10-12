import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Sur-titre en capitales espacées : « NOUVEAUTÉS », nom de marque… */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-xs font-medium tracking-surtitre text-graphite uppercase", className)}
      {...props}
    />
  );
}
