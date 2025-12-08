// pages/api/patient/dashboard.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const patientId = Number(req.query.patientId);
  if (!patientId) {
    return res.status(400).json({ error: "patientId requis" });
  }

  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const [appointments, prescriptions, clinics] = await Promise.all([
      prisma.appointment.findMany({
        where: { patientId },
        include: { doctor: { include: { clinic: true } } },
        orderBy: { date: "asc" },
      }),
      prisma.prescription.findMany({
        where: { patientId },
        include: { doctor: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.clinic.findMany({
        where: {
          OR: [
            { patients: { some: { id: patientId } } },
            { doctors: { some: { appointments: { some: { patientId } } } } },
          ],
        },
        distinct: ["id"],
      }),
    ]);

    const upcoming = appointments.filter((a) => a.date >= now);
    const confirmed = appointments.filter((a) => a.statut === "Confirmé");

    const upcomingAppointments = upcoming.slice(0, 5).map((a) => ({
      id: a.id,
      date: a.date.toISOString().split("T")[0],
      heure: a.heure,
      statut: a.statut,
      doctor: a.doctor ? `${a.doctor.prenom} ${a.doctor.nom}` : "—",
      clinic: a.doctor?.clinic?.nom ?? "—",
    }));

    const lastPrescriptions = prescriptions.map((p) => ({
      id: p.id,
      date: p.createdAt.toISOString().split("T")[0],
      doctor: `${p.doctor.prenom} ${p.doctor.nom}`,
      notes: p.notes,
    }));

    return res.status(200).json({
      stats: {
        upcomingCount: upcoming.length,
        confirmedCount: confirmed.length,
        prescriptionsCount: prescriptions.length,
        clinicsCount: clinics.length,
      },
      upcomingAppointments,
      lastPrescriptions,
    });
  } catch (e) {
    console.error("Erreur dashboard patient:", e);
    return res
      .status(500)
      .json({ error: "Erreur lors du chargement du dashboard patient." });
  }
}
