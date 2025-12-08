// scripts/reset-patient-passwords.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Mot de passe temporaire pour tous les patients
  const plainPassword = "patient123";
  const hash = await bcrypt.hash(plainPassword, 10);

  await prisma.patient.updateMany({
    data: { password: hash },
  });

  console.log(
    "Tous les patients ont maintenant le mot de passe temporaire:",
    plainPassword
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
