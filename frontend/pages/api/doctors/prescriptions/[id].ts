// pages/api/doctors/prescriptions/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  // TODO : utiliser l'id du médecin connecté (auth plus tard)
  const doctorId = 1;

  if (req.method === "PUT") {
    const { medicaments, notes } = req.body;

    if (!medicaments) {
      return res.status(400).json({ error: "Le champ medicaments est obligatoire" });
    }

    try {
      const prescription = await prisma.prescription.update({
        where: { id },
        data: {
          medicaments,
          notes: notes || null,
          doctorId,
        },
      });
      return res.status(200).json({ prescription });
    } catch (e) {
      console.error("Erreur update ordonnance:", e);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.prescription.delete({ where: { id } });
      return res.status(204).end();
    } catch (e) {
      console.error("Erreur suppression ordonnance:", e);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
