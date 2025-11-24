import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'PUT') {
    const { label } = req.body;
    try {
      const speciality = await prisma.speciality.update({ where: { id }, data: { label }});
      res.status(200).json({ speciality });
    } catch (e: any) {
      res.status(500).json({ error: 'Erreur modification', detail: e.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.speciality.delete({ where: { id } });
      res.status(200).json({ message: 'Supprimée' });
    } catch (e: any) {
      res.status(500).json({ error: 'Erreur suppression', detail: e.message });
    }
  } else {
    res.status(405).end();
  }
}
