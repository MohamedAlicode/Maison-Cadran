-- Un code promo peut être annoncé dans la banderole du haut de la boutique.
ALTER TABLE "DiscountCode" ADD COLUMN "showInBanner" BOOLEAN NOT NULL DEFAULT false;
