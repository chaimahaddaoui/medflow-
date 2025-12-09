
// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const prisma = new PrismaClient();

type LoginSuccess = {
  role: "patient" | "doctor" | "receptionist" | "admin";
  userId: number;
  email: string;
  nom: string;
  prenom?: string | null;
};

type LoginError = { error: string };
type LoginResponse = LoginSuccess | LoginError;

function setAuthCookie(res: NextApiResponse, payload: { userId: number; role: string }) {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.setHeader(
    "Set-Cookie",
    serialize("medflow_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email et mot de passe sont obligatoires." });
  }

  try {
    // 1) Patient
    const patient = await prisma.patient.findFirst({ where: { email } });
    if (patient && patient.password) {
      const ok = await bcrypt.compare(password, patient.password);
      if (ok) {
        setAuthCookie(res, { userId: patient.id, role: "patient" });
        return res.status(200).json({
          role: "patient",
          userId: patient.id,
          email: patient.email,
          nom: patient.nom,
          prenom: patient.prenom,
        });
      }
    }

    // 2) Doctor
    const doctor = await prisma.doctor.findFirst({ where: { email } });
    if (doctor && doctor.password) {
      const ok = await bcrypt.compare(password, doctor.password);
      if (ok) {
        setAuthCookie(res, { userId: doctor.id, role: "doctor" });
        return res.status(200).json({
          role: "doctor",
          userId: doctor.id,
          email: doctor.email,
          nom: doctor.nom,
          prenom: doctor.prenom,
        });
      }
    }

    // 3) Receptionist
    const receptionist = await prisma.receptionist.findFirst({ where: { email } });
    if (receptionist && receptionist.password) {
      const ok = await bcrypt.compare(password, receptionist.password);
      if (ok) {
        setAuthCookie(res, { userId: receptionist.id, role: "receptionist" });
        return res.status(200).json({
          role: "receptionist",
          userId: receptionist.id,
          email: receptionist.email,
          nom: receptionist.nom,
          prenom: receptionist.prenom,
        });
      }
    }

    // 4) Admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin && admin.password) {
      const ok = await bcrypt.compare(password, admin.password);
      if (ok) {
        setAuthCookie(res, { userId: admin.id, role: "admin" });
        return res.status(200).json({
          role: "admin",
          userId: admin.id,
          email: admin.email,
          nom: admin.nom,
          prenom: admin.prenom,
        });
      }
    }

    return res.status(401).json({ error: "Email ou mot de passe incorrect." });
  } catch (e) {
    console.error("Erreur login:", e);
    return res.status(500).json({ error: "Erreur serveur lors du login." });
  }
}
