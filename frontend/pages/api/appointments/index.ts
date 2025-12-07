// pages/api/appointments/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET : liste des rendez-vous (tous ou par médecin)
  if (req.method === "GET") {
    const doctorId = req.query.doctorId ? Number(req.query.doctorId) : null;

    const where = doctorId ? { doctorId } : {};

    const appointments = await prisma.appointment.findMany({
      where,
      include: { patient: true, doctor: true },
      orderBy: { date: "asc" },
    });

    return res.status(200).json({ appointments });
  }

  // POST : créer un rendez-vous
  if (req.method === "POST") {
    const { date, heure, statut, patientId, doctorId } = req.body;

    if (!date || !heure || !patientId || !doctorId) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    try {
      // Vérifier si un RDV existe déjà pour ce médecin, ce jour et cette heure
      const existing = await prisma.appointment.findFirst({
        where: {
          doctorId: Number(doctorId),
          date: new Date(date),
          heure,
        },
      });

      if (existing) {
        return res
          .status(409)
          .json({ error: "Ce créneau est déjà réservé pour ce médecin." });
      }

      const appointment = await prisma.appointment.create({
        data: {
          date: new Date(date),
          heure,
          statut: statut || "En attente",
          patientId: Number(patientId),
          doctorId: Number(doctorId),
        },
      });

      return res.status(201).json({ appointment });
    } catch (e) {
      console.error("Erreur création rendez-vous:", e);
      return res.status(500).json({ error: "Erreur création" });
    }
  }

  // Méthode non autorisée
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
