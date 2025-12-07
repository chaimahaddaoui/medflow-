// pages/api/doctors/patients/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const patientId = Number(req.query.id);
    if (isNaN(patientId)) {
      return res.status(400).json({ error: "ID patient invalide" });
    }

    // TODO : remplacer par l'id du médecin connecté (auth plus tard)
    const doctorId = 1;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        dateNaissance: true,
        adresse: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient introuvable" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId, doctorId },
      orderBy: { date: "desc" },
    });

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId, doctorId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      patient,
      appointments,
      prescriptions,
    });
  } catch (e) {
    console.error("Erreur dossier patient médecin:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
