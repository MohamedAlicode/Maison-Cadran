import { describe, expect, it } from "vitest";
import { numeroCommande, numeroFacture } from "@/lib/commandes/numeros";
import { DUREE_SESSION_S, parametresSessionStripe } from "@/lib/commandes/session-stripe";
import { lignesFacture } from "@/lib/facture/lignes";

describe("numéros", () => {
  it("formate les numéros de commande et de facture sur six chiffres", () => {
    expect(numeroCommande(2026, 123)).toBe("MC-2026-000123");
    expect(numeroFacture(2026, 1)).toBe("F-2026-000001");
  });
});

describe("parametresSessionStripe", () => {
  const params = parametresSessionStripe({
    commande: { id: "cmd1", numero: "MC-2026-000001" },
    lignes: [
      {
        id: "p1",
        nom: "PRX Powermatic 80",
        marque: "Tissot",
        reference: "T137.407.11.041.00",
        prixCentimes: 72_500,
        quantite: 1,
      },
    ],
    montants: { livraisonCentimes: 0 },
    urlSite: "https://exemple.fr",
    maintenantS: 1_000_000,
  });

  it("reprend les prix recalculés par le serveur, en centimes", () => {
    expect(params.line_items).toEqual([
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: 72_500,
          product_data: {
            name: "Tissot PRX Powermatic 80",
            description: "Réf. T137.407.11.041.00",
            metadata: { produitId: "p1" },
          },
        },
      },
    ]);
  });

  it("relie la session à la commande et limite la livraison à la France", () => {
    expect(params.metadata).toEqual({ commandeId: "cmd1", numero: "MC-2026-000001" });
    expect(params.client_reference_id).toBe("cmd1");
    expect(params.shipping_address_collection).toEqual({ allowed_countries: ["FR"] });
    expect(params.shipping_options?.[0].shipping_rate_data?.fixed_amount?.amount).toBe(0);
  });

  it("revient sur le site après paiement ou annulation", () => {
    expect(params.success_url).toBe(
      "https://exemple.fr/commande/retour?session_id={CHECKOUT_SESSION_ID}",
    );
    expect(params.cancel_url).toBe("https://exemple.fr/panier?paiement=annule");
    expect(params.expires_at).toBe(1_000_000 + DUREE_SESSION_S);
  });
});

describe("lignesFacture", () => {
  it("retombe sur le total TTC de la commande, livraison comprise", () => {
    const facture = lignesFacture({
      items: [
        {
          brandName: "Orient",
          productName: "Bambino Version 2",
          reference: "RA-AC0M04Y10B",
          unitPriceCents: 18_900,
          vatRate: 2000,
          quantity: 1,
        },
        {
          brandName: "Seiko",
          productName: "5 Sports",
          reference: "SRPD55K1",
          unitPriceCents: 12_000,
          vatRate: 2000,
          quantity: 2,
        },
      ],
      shippingCents: 990,
    });
    expect(facture.lignes).toHaveLength(3);
    expect(facture.totalTtcCentimes).toBe(18_900 + 24_000 + 990);
    expect(facture.totalHtCentimes + facture.totalTvaCentimes).toBe(facture.totalTtcCentimes);
    expect(facture.lignes[1].prixUnitaireHtCentimes).toBe(10_000);
    expect(facture.lignes[2].designation).toMatch(/^Livraison/);
  });
});
