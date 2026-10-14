import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Conteneur centré : 1 440 px max, marges 24 px mobile / 48 px desktop. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-site px-6 lg:px-12", className)} {...props} />;
}
