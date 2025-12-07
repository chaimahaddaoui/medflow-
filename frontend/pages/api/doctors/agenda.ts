// pages/api/doctors/agenda.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const doctorId = req.query.doctorId ? Number(req.query.doctorId) : null;
  const dateParam = typeof req.query.date === "string" ? req.query.date : null;

  if (!doctorId || !dateParam) {
    return res.status(400).json({ error: "doctorId et date (YYYY-MM-DD) requis" });
  }

  const dayStart = new Date(`${dateParam}T00:00:00`);
  const dayEnd = new Date(`${dateParam}T23:59:59`);

  // Créneaux de disponibilité ce jour-là
  const availabilities = await prisma.doctorAvailability.findMany({
    where: {
      doctorId,
      start: { gte: dayStart, lte: dayEnd },
    },
    orderBy: { start: "asc" },
  });

  // Rendez-vous déjà pris ce jour-là
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: { gte: dayStart, lte: dayEnd },
    },
  });

  // Le front utilisera availabilities + appointments
  // pour afficher les heures libres / réservées.
  return res.status(200).json({
    availabilities,
    appointments,
  });
}
