-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "shippingAddress" DROP NOT NULL,
ALTER COLUMN "billingAddress" DROP NOT NULL;

-- Numéros de commande lisibles (MC-2026-000123). Une séquence suffit : un numéro
-- de commande peut avoir des trous, contrairement à un numéro de facture.
CREATE SEQUENCE "commande_numero_seq";
