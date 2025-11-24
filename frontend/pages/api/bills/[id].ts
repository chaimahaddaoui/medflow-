import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'DELETE') {
    try {
      await prisma.bill.delete({ where: { id } });
      res.status(200).json({ message: 'Supprimée' });
    } catch {
      res.status(500).json({ error: 'Erreur suppression' });
    }
  } else if (req.method === 'PUT') {
    const { montant, statut, patientId, appointmentId } = req.body;
    try {
      const bill = await prisma.bill.update({
        where: { id },
        data: {
          montant: parseFloat(montant),
          statut,
          patientId: Number(patientId),
          appointmentId: appointmentId ? Number(appointmentId) : undefined
        }
      });
      res.status(200).json({ bill });
    } catch {
      res.status(500).json({ error: 'Erreur modification' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
