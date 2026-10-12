import { cn } from "@/lib/utils";

type Proprietes = {
  /** Couleur du cadran (valeur CSS). */
  cadran?: string;
  /** Couleur du boîtier et des aiguilles. */
  boitier?: string;
  /** Couleur du bracelet. */
  bracelet?: string;
  className?: string;
  label?: string;
};

/**
 * Illustration de montre utilisée en attendant les vraies photos produit.
 * Vectorielle, légère, et déclinable par couleur de cadran.
 */
export function WatchPlaceholder({
  cadran = "#1d2a3a",
  boitier = "#c8c4bc",
  bracelet = "#8f8a82",
  className,
  label = "Illustration de montre",
}: Proprietes) {
  const index = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={label}
      className={cn("h-auto w-full", className)}
    >
      {/* Bracelet */}
      <rect x="78" y="0" width="44" height="60" rx="4" fill={bracelet} />
      <rect x="78" y="140" width="44" height="60" rx="4" fill={bracelet} />
      {/* Cornes */}
      <rect x="72" y="46" width="56" height="16" rx="3" fill={boitier} />
      <rect x="72" y="138" width="56" height="16" rx="3" fill={boitier} />
      {/* Couronne */}
      <rect x="152" y="94" width="10" height="12" rx="2" fill={boitier} />
      {/* Boîtier et lunette */}
      <circle cx="100" cy="100" r="54" fill={boitier} />
      <circle cx="100" cy="100" r="47" fill={cadran} />
      {/* Index */}
      {index.map((angle) => (
        <rect
          key={angle}
          x="98.5"
          y="58"
          width="3"
          height={angle % 90 === 0 ? 10 : 6}
          fill="#f7f3ec"
          opacity="0.9"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      {/* Aiguilles : 10 h 10, la pose classique */}
      <rect
        x="98.5"
        y="72"
        width="3"
        height="30"
        rx="1.5"
        fill="#f7f3ec"
        transform="rotate(-60 100 100)"
      />
      <rect
        x="99"
        y="62"
        width="2"
        height="40"
        rx="1"
        fill="#f7f3ec"
        transform="rotate(60 100 100)"
      />
      <rect x="99.5" y="60" width="1" height="48" fill="#b08d57" transform="rotate(200 100 100)" />
      <circle cx="100" cy="100" r="3" fill="#b08d57" />
    </svg>
  );
}
