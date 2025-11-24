-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "specialite" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);
