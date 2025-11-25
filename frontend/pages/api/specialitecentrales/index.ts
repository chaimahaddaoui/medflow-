import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const specialities = await prisma.specialityCentral.findMany();
    return res.status(200).json({ specialities });
  }
  if (req.method === 'POST') {
    const { label, description } = req.body;
    const speciality = await prisma.specialityCentral.create({ data: { label, description } });
    return res.status(201).json({ speciality });
  }
  res.status(405).end();
}
