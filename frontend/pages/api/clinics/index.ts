import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET : toutes les cliniques avec spécialités + médecins + spécialité du médecin
  if (req.method === "GET") {
    try {
      const clinics = await prisma.clinic.findMany({
        include: {
          specialites: true,
          doctors: {
            include: {
              specialite: true, // <-- inclure l'objet Speciality lié
            },
          },
        },
        orderBy: { id: "asc" },
      });

      return res.status(200).json({ clinics });
    } catch (e) {
      console.error("Erreur chargement cliniques:", e);
      return res.status(500).json({ error: "Erreur chargement cliniques" });
    }
  }

  // POST : créer une clinique + ses spécialités (inchangé chez toi)
  if (req.method === "POST") {
    const { nom, adresse, telephone, email, logo, horaires, specialiteIds } =
      req.body;

    try {
      const centrales =
        Array.isArray(specialiteIds) && specialiteIds.length > 0
          ? await prisma.specialityCentral.findMany({
              where: { id: { in: specialiteIds } },
            })
          : [];

      const clinic = await prisma.clinic.create({
        data: {
          nom,
          adresse,
          telephone,
          email,
          logo,
          horaires,
          specialites: {
            create: centrales.map((s) => ({
              label: s.label,
              description: s.description ?? null,
            })),
          },
        },
      });

      return res.status(201).json({ clinic });
    } catch (e) {
      console.error("Erreur création clinique:", e);
      const msg = e instanceof Error ? e.message : String(e);
      return res
        .status(500)
        .json({ error: "Erreur création clinique", detail: msg });
    }
  }

  // Méthodes non autorisées
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
