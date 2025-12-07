import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const doctorId = req.query.doctorId ? Number(req.query.doctorId) : null;
  if (!doctorId) return res.status(400).json({ error: "doctorId requis" });

  // optionnel : mois ciblé (YYYY-MM), sinon tout
  const month = typeof req.query.month === "string" ? req.query.month : null;

  const availabilityWhere: any = { doctorId };

  if (month) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 1);
    availabilityWhere.start = { gte: start, lt: end };
  }

  const slots = await prisma.doctorAvailability.findMany({
    where: availabilityWhere,
  });

  // jours où le médecin travaille (au moins un slot)
  const availableDaysSet = new Set<string>();
  slots.forEach((s) => {
    const key = new Date(s.start).toISOString().slice(0, 10);
    availableDaysSet.add(key);
  });

  const availableDays = Array.from(availableDaysSet).sort();

  return res.status(200).json({
    availableDays, // ex: ["2025-11-27","2025-11-28"]
  });
}
