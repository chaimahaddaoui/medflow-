import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const doctors = await prisma.doctor.findMany();
    res.status(200).json({ doctors });
  } else if (req.method === 'POST') {
    const { nom, prenom, email, specialite, telephone } = req.body;
    try {
      const doctor = await prisma.doctor.create({
        data: { nom, prenom, email, specialite, telephone }
      });
      res.status(201).json({ doctor });
    } catch (e) {
      res.status(500).json({ error: 'Erreur création.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
