import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: récupérer doctorId depuis l'auth; pour l’instant paramètre ou 1 par défaut
  const doctorId =
    req.method === "GET"
      ? (req.query.doctorId ? Number(req.query.doctorId) : 1)
      : 1;

  if (req.method === "GET") {
    const slots = await prisma.doctorAvailability.findMany({
      where: { doctorId },
      orderBy: { start: "asc" },
    });
    return res.status(200).json({ slots });
  }

  if (req.method === "POST") {
    const { start, end, type, note } = req.body;
    if (!start || !end) {
      return res.status(400).json({ error: "start et end sont obligatoires" });
    }
    try {
      const slot = await prisma.doctorAvailability.create({
        data: {
          doctorId,
          start: new Date(start),
          end: new Date(end),
          type: type || null,
          note: note || null,
        },
      });
      return res.status(201).json({ slot });
    } catch (e) {
      console.error("Erreur création disponibilité:", e);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end();
}
