import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const specialities = await prisma.speciality.findMany();
      return res.status(200).json({ specialities });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { label, clinicId } = req.body;
      const speciality = await prisma.speciality.create({
        data: { label, clinic: { connect: { id: clinicId } } }
      });
      return res.status(201).json({ speciality });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la création' });
    }
  }

  res.status(405).json({ error: 'Méthode non autorisée' });
}