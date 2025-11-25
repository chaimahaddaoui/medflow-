import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: { method: string; body: { nom: any; adresse: any; telephone: any; email: any; logo: any; horaires: any; specialiteIds: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { clinics?: ({ specialites: { id: number; label: string; clinicId: number; }[]; } & { id: number; nom: string; adresse: string; telephone: string; email: string; logo: string | null; horaires: string | null; createdAt: Date; })[]; clinic?: { id: number; nom: string; adresse: string; telephone: string; email: string; logo: string | null; horaires: string | null; createdAt: Date; }; error?: string; detail?: string; }): any; new(): any; }; end: { (): any; new(): any; }; }; }) {
  if (req.method === 'GET') {
    // Récupère toutes les cliniques avec leurs spécialités associées
    const clinics = await prisma.clinic.findMany({
      include: { specialites: true },
      orderBy: { id: 'asc' }
    });
    return res.status(200).json({ clinics });
  }

  if (req.method === 'POST') {
    const { nom, adresse, telephone, email, logo, horaires, specialiteIds } = req.body;
    try {
      // Récupération des spécialités centrales correspondant aux IDs cochés dans le formulaire
      const centrales = Array.isArray(specialiteIds) && specialiteIds.length > 0
        ? await prisma.specialityCentral.findMany({ where: { id: { in: specialiteIds }}})
        : [];
      // Création de la clinique ET création des lignes "specialite" associées (nested create)
      const clinic = await prisma.clinic.create({
        data: {
          nom, adresse, telephone, email, logo, horaires,
          specialites: {
            create: centrales.map(s => ({
              label: s.label,
              description: s.description ?? null
            }))
          }
        }
      });
      return res.status(201).json({ clinic });
    } catch (e) {
      console.error('Erreur création clinique:', e); // Log utile pour debugging
      const msg = e instanceof Error ? e.message : String(e);
      return res.status(500).json({ error: "Erreur création clinique", detail: msg });
    }
  }

  // Méthodes non autorisées
  return res.status(405).end();
}
