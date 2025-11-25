/* // frontend/pages/api/receptionist/index.ts
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();


async function sendAccountMail(to: any, prenom: any, emailAccount: any, password: any) {
  // Création du transporteur SMTP avec tes infos .env
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"Medflow Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: "[Medflow] Accès réceptionniste",
    text: `Bonjour ${prenom},\n\nVotre compte a été créé !\nEmail : ${emailAccount}\nMot de passe : ${password}\nConnectez-vous sur l’application.`,
    html: `<b>Bonjour ${prenom}</b>,<br>Votre compte de réceptionniste Medflow a été créé.<br><b>Email :</b> ${emailAccount}<br><b>Mot de passe :</b> ${password}<br><br>Connectez-vous sur le site.`
  });
}



export default async function handler(req: { method: string; body: { nom: any; prenom: any; email: any; password: any; telephone: any; clinicId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { receptionists?: ({ clinic: { nom: string; adresse: string; telephone: string; email: string; logo: string | null; horaires: string | null; id: number; createdAt: Date; }; } & { nom: string; telephone: string | null; email: string; id: number; password: string; prenom: string; clinicId: number; createdAt: Date; })[]; receptionist?: { nom: string; telephone: string | null; email: string; id: number; password: string; prenom: string; clinicId: number; createdAt: Date; }; error?: string; detail?: string; }): void; new(): any; }; end: { (): void; new(): any; }; }; }) {
  if (req.method === 'GET') {
    const receptionists = await prisma.receptionist.findMany({ include: { clinic: true } });
    res.status(200).json({ receptionists });
  } else if (req.method === 'POST') {
    const { nom, prenom, email, password, telephone, clinicId } = req.body;
    try {
      const receptionist = await prisma.receptionist.create({
        data: { nom, prenom, email, password, telephone, clinicId: Number(clinicId) }
      });
      
      await sendAccountMail(email, prenom, email, password);

      res.status(201).json({ receptionist });
    } catch (error) {
      console.error("Erreur nodemailer ou post:", error);
      res.status(500).json({ error: "Erreur création", detail: error instanceof Error ? error.message : String(error) });
    }
  } else {
    res.status(405).end();
  }
}
 */
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
const prisma = new PrismaClient();

async function sendAccountMail(to: string, prenom: string, emailAccount: string, password: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS // mot de passe d'application Gmail
      }
    });

    await transporter.sendMail({
      from: `"Medflow Admin" <${process.env.SMTP_USER}>`,
      to,
      subject: "[Medflow] Accès réceptionniste",
      text: `Bonjour ${prenom},\n\nVotre compte a été créé !\nEmail : ${emailAccount}\nMot de passe : ${password}\nConnectez-vous sur l’application.`,
      html: `<b>Bonjour ${prenom}</b>,<br>Votre compte de réceptionniste Medflow a été créé.<br><b>Email :</b> ${emailAccount}<br><b>Mot de passe :</b> ${password}<br><br>Connectez-vous sur le site.`
    });

    console.log("Email envoyé à", to);
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email:", err);
    throw new Error("Impossible d'envoyer l'email");
  }
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const receptionists = await prisma.receptionist.findMany({ include: { clinic: true } });
    return res.status(200).json({ receptionists });
  } else if (req.method === 'POST') {
    const { nom, prenom, email, password, telephone, clinicId } = req.body;

    try {
      // Vérifier si l'email existe déjà
      const existing = await prisma.receptionist.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
      }

      // Créer le réceptionniste
      const receptionist = await prisma.receptionist.create({
        data: { nom, prenom, email, password, telephone, clinicId: Number(clinicId) }
      });

      // Essayer d'envoyer l'email
      try {
        await sendAccountMail(email, prenom, email, password);
      } catch (mailError) {
        console.error(mailError);
        return res.status(201).json({ 
          receptionist, 
          message: "Réceptionniste créé, mais l'email n'a pas pu être envoyé." 
        });
      }

      return res.status(201).json({ 
        receptionist, 
        message: "Réceptionniste ajouté et email envoyé !" 
      });

    } catch (error) {
      console.error("Erreur création réceptionniste:", error);
      return res.status(500).json({ error: "Erreur création", detail: error instanceof Error ? error.message : String(error) });
    }
  } else {
    res.status(405).end();
  }
}
