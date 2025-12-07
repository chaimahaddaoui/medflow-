import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

  if (req.method === "PUT") {
    const { start, end, type, note } = req.body;
    try {
      const slot = await prisma.doctorAvailability.update({
        where: { id },
        data: {
          ...(start ? { start: new Date(start) } : {}),
          ...(end ? { end: new Date(end) } : {}),
          type: type ?? null,
          note: note ?? null,
        },
      });
      return res.status(200).json({ slot });
    } catch (e) {
      console.error("Erreur mise à jour disponibilité:", e);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.doctorAvailability.delete({ where: { id } });
      return res.status(204).end();
    } catch (e) {
      console.error("Erreur suppression disponibilité:", e);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).end();
}
