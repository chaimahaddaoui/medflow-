

import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/* ----------------------------------------------------
   FONCTION: Générer un mot de passe temporaire
---------------------------------------------------- */
function generateTempPassword() {
  return Math.random().toString(36).slice(-10); // ex: "f93k2h8xza"
}

/* ----------------------------------------------------
   FONCTION: Envoi d'email
---------------------------------------------------- */
async function sendAccountMail(to: string, prenom: string, emailAccount: string, tempPassword: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER, // ton email Gmail
      pass: process.env.SMTP_PASS  // mot de passe d'application Gmail
    }
  });

  await transporter.sendMail({
    from: `"Medflow Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: "[Medflow] Accès réceptionniste",
    html: `
      <div style="font-family: Arial; line-height: 1.5;">
        <h2>Bonjour ${prenom},</h2>
        <p>Votre compte a été créé avec succès.</p>

        <h3>Informations de connexion</h3>
        <p><b>Email :</b> ${emailAccount}</p>
        <p><b>Mot de passe temporaire :</b> ${tempPassword}</p>

        <p style="color:red;">⚠ Merci de changer votre mot de passe après la première connexion.</p>

        <p>Cordialement,<br>L'équipe Medflow</p>
      </div>
    `
  });

  console.log("📧 Email envoyé à :", to);
}

/* ----------------------------------------------------
   HANDLER API
---------------------------------------------------- */
export default async function handler(req: any, res: any) {

  // Récupérer tous les réceptionnistes
  if (req.method === 'GET') {
    const receptionists = await prisma.receptionist.findMany({
      include: { clinic: true }
    });
    return res.status(200).json({ receptionists });
  }

  // Ajouter un nouveau réceptionniste
  if (req.method === 'POST') {
    const { nom, prenom, email, telephone, clinicId } = req.body;

    try {
      // 1️⃣ Vérifier si email déjà utilisé
      const exists = await prisma.receptionist.findUnique({ where: { email } });
      if (exists) {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
      }

      // 2️⃣ Générer un mot de passe temporaire
      const tempPassword = generateTempPassword();

      // 3️⃣ Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // 4️⃣ Enregistrer en base
      const receptionist = await prisma.receptionist.create({
        data: {
          nom,
          prenom,
          email,
          telephone,
          password: hashedPassword,
          clinicId: Number(clinicId)
        }
      });

      // 5️⃣ Envoyer l'email
      await sendAccountMail(email, prenom, email, tempPassword);

      return res.status(201).json({
        message: "Réceptionniste créé + email envoyé",
        receptionist
      });

    } catch (error: any) {
      console.error("❌ Erreur création réceptionniste :", error);
      return res.status(500).json({
        error: "Erreur création",
        detail: error.message
      });
    }
  }

  // Méthode non autorisée
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
