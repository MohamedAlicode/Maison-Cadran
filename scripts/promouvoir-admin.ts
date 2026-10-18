// Donne (ou retire) le rôle admin à un compte existant. Le compte doit s'être connecté une fois.
// Usage : npm run admin:promouvoir -- prenom@exemple.fr   (ajouter --retirer pour l'enlever)
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const email = process.argv.slice(2).find((a) => !a.startsWith("--"));
const retirer = process.argv.includes("--retirer");
if (!email) {
  console.error("Indiquez l'e-mail du compte : npm run admin:promouvoir -- prenom@exemple.fr");
  process.exit(1);
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const resultat = await db.user.updateMany({
    where: { email: { equals: email, mode: "insensitive" } },
    data: { role: retirer ? "CUSTOMER" : "ADMIN" },
  });
  await db.$disconnect();

  if (resultat.count === 0) {
    console.error(
      `Aucun compte pour ${email} : connectez-vous une fois sur le site, puis relancez.`,
    );
    process.exit(1);
  }
  console.log(retirer ? `${email} n'est plus admin.` : `${email} est maintenant admin.`);
}

main();
