// pages/api/patients/prescriptions/[id]/pdf.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: "id requis" });

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });

    if (!prescription) {
      return res.status(404).json({ error: "Ordonnance introuvable" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ordonnance-${id}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(18).text("Ordonnance médicale", { align: "center" });
    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        `Médecin : Dr ${prescription.doctor.prenom} ${prescription.doctor.nom}`
      );
    doc.text(
      `Patient : ${prescription.patient.prenom} ${prescription.patient.nom}`
    );
    doc.text(
      `Date : ${prescription.createdAt.toLocaleDateString("fr-FR")}`
    );
    doc.moveDown();

    doc.fontSize(14).text("Médicaments :", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(prescription.medicaments);

    if (prescription.notes) {
      doc.moveDown();
      doc.fontSize(14).text("Notes :", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(prescription.notes);
    }

    doc.end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
