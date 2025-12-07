// pages/api/doctors/patients.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // TODO : remplacer par l'id du médecin connecté
    const doctorId = 1;

    const patients = await prisma.patient.findMany({
      where: {
        appointments: {
          some: { doctorId },
        },
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        dateNaissance: true,
      },
      orderBy: { nom: "asc" },
    });

    return res.status(200).json({ patients });
  } catch (e) {
    console.error("Erreur patients médecin:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
