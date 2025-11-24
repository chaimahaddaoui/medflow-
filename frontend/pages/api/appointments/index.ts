import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true, doctor: true }
    });
    res.status(200).json({ appointments });
  } else if (req.method === 'POST') {
    const { date, heure, statut, patientId, doctorId } = req.body;
    try {
      const appointment = await prisma.appointment.create({
        data: { date: new Date(date), heure, statut, patientId: Number(patientId), doctorId: Number(doctorId) },
      });
      res.status(201).json({ appointment });
    } catch (e) {
      res.status(500).json({ error: 'Erreur création' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
