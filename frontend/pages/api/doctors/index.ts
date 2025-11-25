import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Inclure les relations pour afficher nom clinique/spécialité
    const doctors = await prisma.doctor.findMany({
      include: { clinic: true, specialite: true }
    });
    res.status(200).json({ doctors });
  } else if (req.method === 'POST') {
    const { nom, prenom, email, telephone, clinicId, specialiteId } = req.body;
    try {
      const doctor = await prisma.doctor.create({
        data: {
          nom,
          prenom,
          email,
          telephone,
          clinicId: Number(clinicId),
          specialiteId: Number(specialiteId)
        }
      });
      // Charger les relations pour que le front ait tout de suite le nom de la clinique/spé
      const fullDoctor = await prisma.doctor.findUnique({
        where: { id: doctor.id },
        include: { clinic: true, specialite: true }
      });
      res.status(201).json({ doctor: fullDoctor });
    } catch (e: any) {
      res.status(500).json({ error: 'Erreur création.', detail: e.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
