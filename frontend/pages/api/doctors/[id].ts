import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'DELETE') {
    try {
      await prisma.doctor.delete({ where: { id } });
      res.status(200).json({ message: 'Supprimé' });
    } catch (e: any) {
      res.status(500).json({ error: 'Erreur suppression', detail: e.message });
    }
  } else if (req.method === 'PUT') {
    const { nom, prenom, email, telephone, clinicId, specialiteId } = req.body;
    try {
      const doctor = await prisma.doctor.update({
        where: { id },
        data: {
          nom,
          prenom,
          email,
          telephone,
          clinicId: Number(clinicId),
          specialiteId: Number(specialiteId)
        }
      });
      // Inclure relations pour retour complet après modif
      const fullDoctor = await prisma.doctor.findUnique({
        where: { id },
        include: { clinic: true, specialite: true }
      });
      res.status(200).json({ doctor: fullDoctor });
    } catch (e: any) {
      res.status(500).json({ error: 'Erreur modification', detail: e.message });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
