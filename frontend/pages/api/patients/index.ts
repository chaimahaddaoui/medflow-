import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: { method: string; body: { nom: any; prenom: any; email: any; dateNaissance: any; telephone: any; adresse: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { patients?: { id: number; nom: string; prenom: string; email: string; dateNaissance: Date; telephone: string | null; adresse: string | null; }[]; patient?: { id: number; nom: string; prenom: string; email: string; dateNaissance: Date; telephone: string | null; adresse: string | null; }; error?: string; }): void; new(): any; }; end: { (): void; new(): any; }; }; }) {
  if (req.method === 'GET') {
    const patients = await prisma.patient.findMany({ orderBy: { id: 'asc' } });
    res.status(200).json({ patients });
  } else if (req.method === 'POST') {
    const { nom, prenom, email, dateNaissance, telephone, adresse } = req.body;
    try {
      const patient = await prisma.patient.create({
        data: { nom, prenom, email, dateNaissance: new Date(dateNaissance), telephone, adresse }
      });
      res.status(201).json({ patient });
    } catch (e) {
      res.status(500).json({ error: 'Erreur création' });
    }
  } else {
    res.status(405).end();
  }
}
