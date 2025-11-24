import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: { method: string; body: { nom: any; adresse: any; telephone: any; email: any; logo: any; horaires: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { clinics?: any; clinic?: any; error?: string; detail?: any; }): void; new(): any; }; end: { (): void; new(): any; }; }; }) {
  if (req.method === 'GET') {
    const clinics = await prisma.clinic.findMany({ orderBy: { id: 'asc' } });
    res.status(200).json({ clinics });
  } else if (req.method === 'POST') {
    const { nom, adresse, telephone, email, logo, horaires } = req.body;
    try {
      const clinic = await prisma.clinic.create({
        data: { nom, adresse, telephone, email, logo, horaires }
      });
      res.status(201).json({ clinic });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      res.status(500).json({ error: 'Erreur création clinique', detail: errorMessage });
    }
  } else {
    res.status(405).end();
  }
}
