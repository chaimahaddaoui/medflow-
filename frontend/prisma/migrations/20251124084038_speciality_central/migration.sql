-- AlterTable
ALTER TABLE "Doctor" ALTER COLUMN "clinicId" DROP NOT NULL,
ALTER COLUMN "specialiteId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SpecialityCentral" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SpecialityCentral_pkey" PRIMARY KEY ("id")
);
