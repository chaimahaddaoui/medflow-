-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
