// pages/api/receptionists/bills/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  // TODO : sécuriser avec JWT role = "receptionist"

  if (req.method === "PUT") {
    const { montant, statut, modePaiement } = req.body as {
      montant?: number;
      statut?: string;
      modePaiement?: string;
    };

    if (!statut) {
      return res.status(400).json({ error: "statut obligatoire" });
    }

    try {
      const bill = await prisma.bill.update({
        where: { id },
        data: {
          montant: montant !== undefined ? montant : undefined,
          statut,
          modePaiement: modePaiement ?? null,
          datePaiement: statut === "Payée" ? new Date() : null,
        },
      });

      return res.status(200).json({ bill });
    } catch (e) {
      console.error("Erreur update facture:", e);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
