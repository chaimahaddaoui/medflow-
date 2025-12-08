// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ detail: "Méthode non autorisée" });
  }

  const {
    nom,
    prenom,
    email,
    password,
    dateNaissance,
    telephone,
    adresse,
    clinicId,
  } = req.body;

  if (!nom || !prenom || !email || !password || !dateNaissance || !clinicId) {
    return res.status(400).json({ detail: "Champs obligatoires manquants." });
  }

  try {
    const existing = await prisma.patient.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ detail: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await prisma.patient.create({
      data: {
        nom,
        prenom,
        email,
        password: hashedPassword,
        dateNaissance: new Date(dateNaissance),
        telephone: telephone || null,
        adresse: adresse || null,
        clinicId: Number(clinicId),
      },
    });

    return res.status(201).json({
      message: "Compte patient créé avec succès.",
      patient: {
        id: patient.id,
        nom: patient.nom,
        prenom: patient.prenom,
        email: patient.email,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ detail: "Erreur lors de la création du compte." });
  }
}
