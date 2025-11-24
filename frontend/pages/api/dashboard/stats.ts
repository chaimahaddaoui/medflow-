import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type StatsData = {
  totalPatients: number;
  appointmentsToday: number;
  totalDoctors: number;
  totalRevenue: number;
  recentAppointments: Array<{
    id: string;
    patient: string;
    doctor: string;
    date: string;
    time: string;
    status: string;
  }>;
  notifications: string[];
  
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsData>
) {
  // Nombre total de patients/doctors
  const totalPatients = await prisma.patient.count();
  const totalDoctors = await prisma.doctor.count();

  // Somme des "montant" de toutes les factures
  const totalRevenue = await prisma.bill.aggregate({
    _sum: { montant: true }
  }).then(r => r._sum.montant ?? 0);

  // Nombre de rendez-vous "aujourd'hui"
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const appointmentsToday = await prisma.appointment.count({
    where: {
      date: {
        gte: today,
        lt: tomorrow,
      }
    }
  });

  // Les 3 prochains RDV
  const recentAppointmentsDB = await prisma.appointment.findMany({
    orderBy: { date: 'asc' },
    take: 3,
    include: { patient: true, doctor: true }
  });
  const recentAppointments = recentAppointmentsDB.map(a => ({
    id: a.id.toString(),
    patient: a.patient ? `${a.patient.nom} ${a.patient.prenom}` : '',
    doctor: a.doctor ? `Dr. ${a.doctor.nom}` : '',
    date: a.date.toLocaleDateString(),
    time: a.heure,
    status: a.statut,
  }));
 
  // Notifications exemples (à personnaliser selon ta logique réelle)
  const notifications = [
    'Nouveau patient inscrit',
    'Validation facture requise',
    'Rendez-vous à valider'
  ];

  res.status(200).json({
    totalPatients,
    appointmentsToday,
    totalDoctors,
    totalRevenue,
    recentAppointments,
    notifications
  });
}
