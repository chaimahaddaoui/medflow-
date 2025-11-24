import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'DELETE') {
    try {
      await prisma.doctor.delete({ where: { id } });
      res.status(200).json({ message: 'Supprimé' });
    } catch {
      res.status(500).json({ error: 'Erreur suppression' });
    }
  } else if (req.method === 'PUT') {
    const { nom, prenom, email, specialite, telephone } = req.body;
    try {
      const doctor = await prisma.doctor.update({
        where: { id },
        data: { nom, prenom, email, specialite, telephone }
      });
      res.status(200).json({ doctor });
    } catch {
      res.status(500).json({ error: 'Erreur modification' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
