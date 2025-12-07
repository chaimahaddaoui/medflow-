// pages/api/doctors/dashboard.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DashboardResponse = {
  rdvEnAttente: number;
  rdvConfirmes: number;
  totalRdvAujourdhui: number;
  rdvDuJour: {
    id: number;
    patient: string;
    heure: string;
    statut: "En attente" | "Confirmé" | "Annulé";
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // TODO : remplacer par l'id du médecin connecté (session / token)
    const doctorId = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Tous les rendez-vous du jour pour ce médecin
    const appointmentsToday = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        patient: true,
      },
      orderBy: { date: "asc" },
    });

    // Comptages par statut
    const rdvEnAttente = appointmentsToday.filter(
      (a) => a.statut === "PENDING"
    ).length;

    const rdvConfirmes = appointmentsToday.filter(
      (a) => a.statut === "CONFIRMED"
    ).length;

    const totalRdvAujourdhui = appointmentsToday.length;

    const rdvDuJour = appointmentsToday.map((a) => {
      const statut: "En attente" | "Confirmé" | "Annulé" = a.statut === "CONFIRMED"
        ? "Confirmé"
        : a.statut === "CANCELLED"
        ? "Annulé"
        : "En attente";
      
      return {
        id: a.id,
        patient: `${a.patient.prenom} ${a.patient.nom}`,
        heure: a.date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        statut,
      };
    });

    const data: DashboardResponse = {
      rdvEnAttente,
      rdvConfirmes,
      totalRdvAujourdhui,
      rdvDuJour,
    };

    return res.status(200).json(data);
  } catch (e) {
    console.error("Erreur dashboard docteur:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
