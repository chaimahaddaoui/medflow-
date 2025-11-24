import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { totalPatients: number; totalDoctors: number; totalRevenu: number; rdvThisMonth: number; rdvParStatut: any; revenuParMois: Record<string, number>; }): void; new(): any; }; }; }) {
  // Statistiques basiques
  const totalPatients = await prisma.patient.count();
  const totalDoctors = await prisma.doctor.count();
  const totalRevenu = await prisma.bill.aggregate({ _sum: { montant: true } }).then(r => r._sum.montant ?? 0);
  // RDV ce mois
  const rdvThisMonth = await prisma.appointment.count({
    where: {
      date: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      }
    }
  });
  // Statut RDV
  const rdvParStatut = Object.fromEntries(await Promise.all(
    ["Confirmé", "En attente", "Annulé"].map(async statut => [
      statut,
      await prisma.appointment.count({ where: { statut } })
    ])
  ));
  // Revenus par mois sur 12 mois
  const revenuParMois: Record<string, number> = {};
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const debut = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const fin = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const sum = await prisma.bill.aggregate({
      _sum: { montant: true },
      where: {
        dateCreation: { gte: debut, lt: fin }
      }
    });
    revenuParMois[`${debut.getMonth() + 1}/${debut.getFullYear()}`] = sum._sum.montant ?? 0;
  }

  res.status(200).json({ totalPatients, totalDoctors, totalRevenu, rdvThisMonth, rdvParStatut, revenuParMois });
}
