// /pages/api/clinics/[id].ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req: { query: { id: any; }; method: string; body: { nom: any; adresse: any; telephone: any; email: any; logo: any; horaires: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { clinic?: { id: number; nom: string; adresse: string; telephone: string; email: string; logo: string | null; horaires: string | null; createdAt: Date; }; error?: string; message?: string; }): void; new(): any; }; end: { (): void; new(): any; }; }; }) {
  const id = Number(req.query.id);
  if (req.method === 'PUT') {
    const { nom, adresse, telephone, email, logo, horaires } = req.body;
    try {
      const clinic = await prisma.clinic.update({
        where: { id },
        data: { nom, adresse, telephone, email, logo, horaires }
      });
      res.status(200).json({ clinic });
    } catch (e) {
      res.status(500).json({ error: 'Erreur modification.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.clinic.delete({ where: { id } });
      res.status(200).json({ message: 'Supprimée' });
    } catch {
      res.status(500).json({ error: 'Erreur suppression.' });
    }
  } else {
    res.status(405).end();
  }
}
