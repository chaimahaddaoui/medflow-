import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { clinicId } = req.query;
    const where = clinicId ? { clinicId: Number(clinicId) } : {};
    const specialities = await prisma.speciality.findMany({ where });
    res.status(200).json({ specialities });
  } else if (req.method === 'POST') {
    const { label, clinicId } = req.body;
    try {
      const speciality = await prisma.speciality.create({
        data: { label, clinicId: Number(clinicId) }
      });
      res.status(201).json({ speciality });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      res.status(500).json({ error: 'Erreur création spécialité', detail: errorMessage });
    }
  } else {
    res.status(405).end();
  }
}
