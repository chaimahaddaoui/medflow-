// pages/api/patients/index.ts
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function sendWelcomeEmail(
  to: string,
  patientName: string,
  adresse: string,
  clinicName: string,
  doctors: Array<{ nom: string; prenom: string; specialite: string | null }>,
  loginEmail: string,
  tempPassword: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  const doctorsList = doctors
    .map(
      (d) =>
        `<li><strong>${d.prenom} ${d.nom}</strong> - ${
          d.specialite || "Spécialité non spécifiée"
        }</li>`
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: white; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0066cc;">Bienvenue sur Medflow !</h1>
        
        <p>Bonjour <strong>${patientName}</strong>,</p>
        
        <p>Votre compte patient a été créé avec succès par votre clinique.</p>

        <h2 style="color: #0066cc; margin-top: 20px;">🔐 Informations de connexion</h2>
        <div style="background-color:#f0f8ff;padding:15px;border-radius:5px;border-left:4px solid #0066cc;">
          <p><strong>Adresse de connexion :</strong> 
            <a href="${appUrl}/login">${appUrl}/login</a>
          </p>
          <p><strong>Email :</strong> ${loginEmail}</p>
          <p><strong>Mot de passe temporaire :</strong> ${tempPassword}</p>
        </div>
        <p style="font-size:12px;color:#666;margin-top:8px;">
          Pour des raisons de sécurité, nous vous recommandons de changer ce mot de passe après votre première connexion.
        </p>

        <h2 style="color: #0066cc; margin-top: 30px;">📍 Informations de votre clinique</h2>
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; border-left: 4px solid #0066cc;">
          <p><strong>Clinique :</strong> ${clinicName || "Non précisée"}</p>
          <p><strong>Adresse :</strong> ${adresse || "Non précisée"}</p>
        </div>
        
        <h2 style="color: #0066cc; margin-top: 30px;">👨‍⚕️ Médecins disponibles</h2>
        <ul style="list-style-type: none; padding: 0;">
          ${
            doctorsList ||
            "<li>Aucun médecin enregistré pour le moment.</li>"
          }
        </ul>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          Pour toute question, veuillez contacter votre clinique directement.
        </p>
        
        <p style="text-align: center; margin-top: 20px; color: #0066cc;">
          <strong>Medflow - Gestion de rendez-vous médicaux</strong>
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Medflow" <${process.env.SMTP_USER}>`,
    to,
    subject: "[Medflow] Bienvenue ! Votre compte a été créé",
    html: htmlContent,
  });
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const patients = await prisma.patient.findMany({
      orderBy: { id: "asc" },
    });
    return res.status(200).json({ patients });
  }

  if (req.method === "POST") {
    const {
      nom,
      prenom,
      email,
      dateNaissance,
      telephone,
      adresse,
      clinicId,
    } = req.body;

    try {
      // 1) Mot de passe temporaire en clair
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // 2) Création du patient avec mot de passe haché
      const patient = await prisma.patient.create({
        data: {
          nom,
          prenom,
          email,
          dateNaissance: new Date(dateNaissance),
          telephone,
          adresse,
          password: hashedPassword,
          clinicId: clinicId ? Number(clinicId) : null,
        },
      });

      // 3) Récupérer clinique + médecins pour l’email
      let clinicName = "";
      let clinicAddress = "";
      let doctors: Array<{
        nom: string;
        prenom: string;
        specialite: string | null;
      }> = [];

      if (clinicId) {
        const clinic = await prisma.clinic.findUnique({
          where: { id: Number(clinicId) },
          include: {
            doctors: {
              include: { specialite: true },
            },
          },
        });

        if (clinic) {
          clinicName = clinic.nom;
          clinicAddress = clinic.adresse;
          doctors = clinic.doctors.map((d) => ({
            nom: d.nom,
            prenom: d.prenom,
            specialite: d.specialite?.label || "Non spécifiée",
          }));
        }
      }

      // 4) Envoyer l’email de bienvenue + identifiants
      await sendWelcomeEmail(
        email,
        `${prenom} ${nom}`,
        clinicAddress,
        clinicName,
        doctors,
        email,
        tempPassword
      );

      return res.status(201).json({ patient });
    } catch (e) {
      console.error("Erreur création patient:", e);
      const detail = e instanceof Error ? e.message : String(e);
      return res.status(500).json({ error: "Erreur création", detail });
    }
  }

  return res.status(405).end();
}
