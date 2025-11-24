import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: { query: { id: any; }; method: string; body: { statut: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { appointment?: { id: number; date: Date; heure: string; statut: string; patientId: number; doctorId: number; }; error?: string; cause?: string; }): void; new(): any; }; end: { (): void; new(): any; }; }; }) {
  const id = Number(req.query.id);
  if (req.method === 'PUT') {
    const { statut } = req.body;
    console.log("API PUT statut", { id, statut, body: req.body });
    try {
      const rdv = await prisma.appointment.update({
        where: { id },
        data: { statut },
      });
      res.status(200).json({ appointment: rdv });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error("Erreur détail:", e);
      res.status(500).json({ error: "Erreur de mise à jour", cause: errorMessage });
    }
  } else {
    res.status(405).end();
  }
}
