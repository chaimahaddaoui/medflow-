// pages/api/appointments/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  if (req.method === "PUT") {
    const { statut } = req.body;
    if (!statut) {
      return res.status(400).json({ error: "statut obligatoire" });
    }

    try {
      const rdv = await prisma.appointment.update({
        where: { id },
        data: { statut },
      });
      return res.status(200).json({ appointment: rdv });
    } catch (e) {
      console.error("Erreur update rendez-vous:", e);
      return res.status(500).json({ error: "Erreur de mise à jour" });
    }
  }

  res.setHeader("Allow", ["PUT"]);
  return res.status(405).end();
}
