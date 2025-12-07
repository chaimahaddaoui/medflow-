import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// ------------------------------------
// Fonction pour générer un mot de passe
// ------------------------------------
function generatePassword(length = 10) {
  return Math.random().toString(36).slice(-length);
}

// ------------------------------------
// ENVOI EMAIL AU MÉDECIN
// ------------------------------------
async function sendDoctorMail(
  to: string,
  prenom: string,
  email: string,
  plainPassword: string,
  clinicName: string,
  specialiteName: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"Medflow Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: "[Medflow] Création de votre compte médecin",
    html: `
      <div style="font-family: Arial; line-height: 1.6;">
        <h2>Bonjour Dr. ${prenom},</h2>

        <p>Votre compte a été créé avec succès sur <b>Medflow</b>.</p>

        <h3> Informations de connexion</h3>
        <p><b>Email :</b> ${email}</p>
        <p><b>Mot de passe :</b> ${plainPassword}</p>
        <h3>🏥 Informations professionnelles</h3>
        <p><b>Clinique :</b> ${clinicName}</p>
        <p><b>Spécialité :</b> ${specialiteName}</p>

        <br>
        <p>Nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>

        <p>Cordialement,<br>
        <b>L'équipe Medflow</b></p>
      </div>
    `
  });
}

// ------------------------------------
//            HANDLER API
// ------------------------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // ---------------------------------
  // GET : Liste des médecins
  // ---------------------------------
  if (req.method === 'GET') {
    const doctors = await prisma.doctor.findMany({
      include: {
        clinic: true,
        specialite: true
      }
    });

    return res.status(200).json({ doctors });
  }

  // ---------------------------------
  // POST : Création médecin
  // ---------------------------------
  if (req.method === 'POST') {
    const { nom, prenom, email, telephone, clinicId, specialiteId, password } = req.body;

    try {
      // 1. Si le frontend n’envoie pas de mot de passe → générer un mot de passe
      const plainPassword = password && password.trim() !== ""
        ? password
        : generatePassword();

      // 2. Hash du mot de passe
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // 3. Création en base
      const doctor = await prisma.doctor.create({
        data: {
          nom,
          prenom,
          email,
          telephone,
          password: hashedPassword,
          clinicId: Number(clinicId),
          specialiteId: Number(specialiteId)
        }
      });

      // 4. Récupérer les infos complètes (avec relations)
      const fullDoctor = await prisma.doctor.findUnique({
        where: { id: doctor.id },
        include: { clinic: true, specialite: true }
      });

      // 5. Envoi email au médecin
      await sendDoctorMail(
        email,
        prenom,
        email,
        plainPassword,
        fullDoctor?.clinic?.nom ?? "Clinique inconnue",
        fullDoctor?.specialite?.label ?? "Spécialité inconnue"
      );

      return res.status(201).json({ doctor: fullDoctor });

    } catch (error: any) {
      console.error("❌ Erreur création médecin :", error);
      return res.status(500).json({
        error: "Erreur lors de la création du médecin.",
        detail: error.message
      });
    }
  }

  // Méthodes non autorisées
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
