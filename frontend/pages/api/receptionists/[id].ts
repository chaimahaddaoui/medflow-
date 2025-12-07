import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const id = Number(req.query.id);

  if (req.method === 'PUT') {
    const { nom, prenom, email, telephone, clinicId } = req.body;
    try {
      const receptionist = await prisma.receptionist.update({
        where: { id },
        data: {
          nom,
          prenom,
          email,
          telephone,
          clinicId: clinicId ? Number(clinicId) : undefined
        }
      });
      return res.status(200).json({ receptionist });
    } catch (e) {
      return res.status(500).json({ error: 'Erreur update réceptionniste' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.receptionist.delete({ where: { id } });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ error: 'Erreur suppression réceptionniste' });
    }
  }

  return res.status(405).end();
}
