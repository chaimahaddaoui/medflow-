// pages/api/patients/prescriptions/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: "id requis" });

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { doctor: true },
    });
    if (!prescription) {
      return res.status(404).json({ error: "Ordonnance introuvable" });
    }

    return res.status(200).json({
      prescription: {
        id: prescription.id,
        createdAt: prescription.createdAt.toISOString(),
        medicaments: prescription.medicaments,
        notes: prescription.notes,
        doctor: {
          id: prescription.doctor.id,
          nom: prescription.doctor.nom,
          prenom: prescription.doctor.prenom,
        },
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
