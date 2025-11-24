import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const bills = await prisma.bill.findMany({
      include: { patient: true, appointment: true }
    });
    res.status(200).json({ bills });
  } else if (req.method === 'POST') {
    const { montant, statut, patientId, appointmentId } = req.body;
    try {
      const bill = await prisma.bill.create({
        data: {
          montant: parseFloat(montant),
          statut,
          patientId: Number(patientId),
          appointmentId: appointmentId ? Number(appointmentId) : undefined
        }
      });
      res.status(201).json({ bill });
    } catch {
      res.status(500).json({ error: 'Erreur facture' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
