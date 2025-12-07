// scripts/hash.ts
import bcrypt from "bcryptjs";

async function main() {
  const hash = await bcrypt.hash("chaimaadmin", 10); 
  console.log(hash);
}
main();
