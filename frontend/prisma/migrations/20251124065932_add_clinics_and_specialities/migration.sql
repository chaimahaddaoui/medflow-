/* /*
  Warnings:

  - You are about to drop the column `specialite` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "specialite",
ADD COLUMN     "clinicId" INTEGER,
ADD COLUMN     "specialiteId" INTEGER;

-- CreateTable
CREATE TABLE "Speciality" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_specialiteId_fkey" FOREIGN KEY ("specialiteId") REFERENCES "Speciality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Speciality" ADD CONSTRAINT "Speciality_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 */
-- CRÉE la table Clinic si nécessaire
CREATE TABLE IF NOT EXISTS "Clinic" (
    "id" SERIAL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logo" TEXT,
    "horaires" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CRÉE la table Speciality AVANT toute insertion
CREATE TABLE IF NOT EXISTS "Speciality" (
    "id" SERIAL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL
);

-- Ajoute les champs dans Doctor
ALTER TABLE "Doctor" DROP COLUMN IF EXISTS "specialite";
ALTER TABLE "Doctor" ADD COLUMN "clinicId" INTEGER;
ALTER TABLE "Doctor" ADD COLUMN "specialiteId" INTEGER;

-- Insère la clinique démo si elle n'existe pas
INSERT INTO "Clinic" (id, nom, adresse, telephone, email, "createdAt")
VALUES (1, 'Clinique Démo', 'Adresse', '00000000', 'demo@demo.com', NOW())
ON CONFLICT DO NOTHING;

-- Ici la table Speciality existe, donc l'INSERT marche
INSERT INTO "Speciality" (id, label, "clinicId")
VALUES (1, 'Générale', 1)
ON CONFLICT DO NOTHING;

UPDATE "Doctor" SET "clinicId" = 1, "specialiteId" = 1 WHERE "clinicId" IS NULL OR "specialiteId" IS NULL;

ALTER TABLE "Doctor" ALTER COLUMN "clinicId" SET NOT NULL;
ALTER TABLE "Doctor" ALTER COLUMN "specialiteId" SET NOT NULL;

-- FOREIGN KEYS
ALTER TABLE "Speciality"
    ADD CONSTRAINT "Speciality_clinicId_fkey"
    FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Doctor"
    ADD CONSTRAINT "Doctor_specialiteId_fkey"
    FOREIGN KEY ("specialiteId") REFERENCES "Speciality"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Doctor"
    ADD CONSTRAINT "Doctor_clinicId_fkey"
    FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
