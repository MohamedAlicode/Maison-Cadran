// Favoris du client connecté, lus par le navigateur : les pages du catalogue restent en cache
// pour tout le monde, et seuls les cœurs se mettent à jour.
import { clientConnecte, idsFavoris } from "@/lib/compte/serveur";

export async function GET() {
  const client = await clientConnecte();
  return Response.json(
    { connecte: Boolean(client), ids: client ? await idsFavoris(client.id) : [] },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
