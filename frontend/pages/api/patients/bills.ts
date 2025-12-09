// pages/api/patients/bills.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const token = req.cookies.medflow_token;
  if (!token) return res.status(401).json({ error: "Non authentifié" });

  let payload: any;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET manquant");
    payload = jwt.verify(token, secret);
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }

  if (payload.role !== "patient") {
    return res.status(403).json({ error: "Réservé aux patients" });
  }

  const patientId = Number(payload.userId);
  if (!patientId) {
    return res.status(400).json({ error: "patientId invalide" });
  }

  const bills = await prisma.bill.findMany({
    where: { patientId },
    include: {
      appointment: {
        include: { doctor: true },
      },
    },
    orderBy: { dateCreation: "desc" },
  });

  const formatted = bills.map((b) => ({
    id: b.id,
    montant: b.montant,
    statut: b.statut,
    dateCreation: b.dateCreation.toISOString(),
    appointment: b.appointment
      ? {
          id: b.appointment.id,
          date: b.appointment.date.toISOString(),
          heure: b.appointment.heure,
          doctor: `${b.appointment.doctor.prenom} ${b.appointment.doctor.nom}`,
        }
      : null,
  }));

  return res.status(200).json({ bills: formatted });
}
