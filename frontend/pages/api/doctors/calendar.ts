// pages/api/doctors/calendar.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const doctorId = req.query.doctorId ? Number(req.query.doctorId) : null;
  const month = typeof req.query.month === "string" ? req.query.month : null; // "2025-11"

  if (!doctorId || !month) {
    return res.status(400).json({ error: "doctorId et month (YYYY-MM) requis" });
  }

  const [year, m] = month.split("-").map(Number);
  const startMonth = new Date(year, m - 1, 1);
  const endMonth = new Date(year, m, 1);

  // Dispos du mois (créneaux ouverts ou pause)
  const availabilities = await prisma.doctorAvailability.findMany({
    where: {
      doctorId,
      start: { gte: startMonth, lt: endMonth },
    },
  });

  // Rendez-vous du mois (utiles pour les heures, pas pour bloquer le jour)
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: { gte: startMonth, lt: endMonth },
    },
  });

  // Map jour -> infos
  type DayInfo = {
    hasPause: boolean;
    hasAppointment: boolean;
  };

  const days = new Map<string, DayInfo>();

  const ensureDay = (d: string) => {
    if (!days.has(d)) {
      days.set(d, { hasPause: false, hasAppointment: false });
    }
    return days.get(d)!;
  };

  availabilities.forEach((a) => {
    const key = new Date(a.start).toISOString().slice(0, 10);
    const info = ensureDay(key);
    if (a.type === "pause") {
      info.hasPause = true;
    }
  });

  appointments.forEach((a) => {
    const key = new Date(a.date).toISOString().slice(0, 10);
    const info = ensureDay(key);
    info.hasAppointment = true;
  });

  // Retour : tableau de jours avec un statut
  const calendar = Array.from(days.entries()).map(([date, info]) => {
    let status: "reserved" | "blocked" | "available";

    // Jour bloqué uniquement si le médecin a mis une pause couvrant ce jour
    if (info.hasPause) {
      status = "blocked";
    } else {
      // Tous les autres jours sont disponibles :
      // les heures déjà réservées seront gérées dans /doctors/agenda
      status = "available";
    }

    return { date, status };
  });

  return res.status(200).json({ calendar });
}
