import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administrator";

  if (!email || !password) {
    console.error("❌ Błąd: Ustaw zmienne ADMIN_EMAIL i ADMIN_PASSWORD w pliku .env");
    process.exit(1);
  }

  // Sprawdź czy admin już istnieje
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`Admin z emailem ${email} już istnieje.`);
    return;
  }

  // Hashuj hasło
  const passwordHash = await hash(password, 12);

  // Utwórz admina
  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      name,
    },
  });

  console.log(`Admin utworzony pomyślnie:`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Nazwa: ${admin.name}`);
  console.log(`\n⚠️  WAŻNE: Zmień hasło po pierwszym logowaniu!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
