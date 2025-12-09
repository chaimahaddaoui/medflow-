// pages/api/receptionists/appointments-with-bills.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        bill: { isNot: null }, // seulement les RDV qui ont une facture
      },
      include: {
        patient: true,
        doctor: true,
        bill: true,
      },
      orderBy: { date: "asc" },
    });

    const formatted = appointments.map((a) => ({
      id: a.id,
      patient: { nom: a.patientId, prenom: a.patientId },
      doctor: { nom: a.doctorId },
      date: a.date.toISOString(),
      heure: a.heure,
      statutRdv: a.statut,
      billId: a.bill!.id,
      billStatut: a.bill!.statut,
      montant: a.bill!.montant,
    }));

    return res.status(200).json({ appointments: formatted });
  } catch (e) {
    console.error("Erreur RDV + factures:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
