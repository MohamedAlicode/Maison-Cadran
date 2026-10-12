import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne des classes Tailwind en résolvant les conflits (ex. « px-2 » puis « px-4 »). */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
