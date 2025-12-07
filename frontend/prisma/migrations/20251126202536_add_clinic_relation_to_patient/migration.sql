-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_clinicId_fkey";

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "password" DROP DEFAULT,
ALTER COLUMN "clinicId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
