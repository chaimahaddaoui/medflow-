/* import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO : récupérer l'id du médecin connecté
  const doctorId = 1;

  if (req.method === "POST") {
    const { patientId, appointmentId, medicaments, notes } = req.body;

    if (!patientId || !medicaments) {
      return res.status(400).json({ error: "patientId et medicaments sont obligatoires" });
    }

    try {
      const prescription = await prisma.prescription.create({
        data: {
          doctorId,
          patientId: Number(patientId),
          appointmentId: appointmentId ? Number(appointmentId) : null,
          medicaments,
          notes: notes || null,
        },
      });

      return res.status(201).json({ prescription });
    } catch (e) {
      console.error("Erreur création ordonnance:", e);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  if (req.method === "GET") {
    const { patientId } = req.query;

    try {
      const prescriptions = await prisma.prescription.findMany({
        where: {
          doctorId,
          ...(patientId ? { patientId: Number(patientId) } : {}),
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ prescriptions });
    } catch (e) {
      console.error("Erreur liste ordonnances:", e);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
 */

// pages/api/doctors/prescriptions/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO : récupérer l'id du médecin connecté (via JWT)
  const doctorId = 1;

  if (req.method === "POST") {
    const { patientId, appointmentId, medicaments, notes } = req.body;

    if (!patientId || !medicaments) {
      return res
        .status(400)
        .json({ error: "patientId et medicaments sont obligatoires" });
    }

    try {
      const patientIdNum = Number(patientId);
      const appointmentIdNum = appointmentId ? Number(appointmentId) : null;

      // 1) Déterminer le montant par défaut de la consultation
      let montant = 60; // valeur par défaut

      // Exemple (optionnel) : adapter selon la spécialité du médecin
      // const doctor = await prisma.doctor.findUnique({
      //   where: { id: doctorId },
      //   include: { specialite: true },
      // });
      // if (doctor?.specialite?.label === "Cardiologie") montant = 80;

      // 2) Créer ordonnance + facture dans une transaction
      const [prescription, bill] = await prisma.$transaction([
        prisma.prescription.create({
          data: {
            doctorId,
            patientId: patientIdNum,
            appointmentId: appointmentIdNum,
            medicaments,
            notes: notes || null,
          },
        }),
        prisma.bill.create({
          data: {
            montant,
            statut: "En attente",
            patientId: patientIdNum,
            appointmentId: appointmentIdNum,
          },
        }),
      ]);

      return res.status(201).json({ prescription, bill });
    } catch (e) {
      console.error("Erreur création ordonnance + facture:", e);
      return res
        .status(500)
        .json({ error: "Erreur serveur lors de la création." });
    }
  }

  if (req.method === "GET") {
    const { patientId } = req.query;

    try {
      const prescriptions = await prisma.prescription.findMany({
        where: {
          doctorId,
          ...(patientId ? { patientId: Number(patientId) } : {}),
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ prescriptions });
    } catch (e) {
      console.error("Erreur liste ordonnances:", e);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
