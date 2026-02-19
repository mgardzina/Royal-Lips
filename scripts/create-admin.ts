
import "dotenv/config";
import { Pool } from "pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL?.replace(/[?&]sslmode=[^&]+/, "");

const pool = new Pool({
  connectionString,
  // ssl: { rejectUnauthorized: false }, // Disable SSL for local proxy connection
});

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;
  const phone_number = process.env.ADMIN_PHONE_NUMBER;

  if (!email || !password || !name || !phone_number) {
    console.error("❌ Błąd: Ustaw zmienne ADMIN_EMAIL, ADMIN_PASSWORD i ADMIN_NAME w pliku .env");
    process.exit(1);
  }

  // Sprawdź czy admin już istnieje
  const existing = await pool.query(
    'SELECT id, email FROM "AdminUser" WHERE email = $1',
    [email]
  );

  if (existing.rows.length > 0) {
    console.log(`Admin z emailem ${email} już istnieje.`);
    await pool.end();
    return;
  }

  // Hashuj hasło
  const passwordHash = await hash(password, 12);

  // Utwórz admina
  const result = await pool.query(
    'INSERT INTO "AdminUser" (id, email, "passwordHash", name, phone_number) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING id, email, name',
    [email, passwordHash, name, phone_number]
  );

  const admin = result.rows[0];
  console.log(`✅ Admin utworzony pomyślnie:`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Nazwa: ${admin.name}`);
  console.log(`   Numer telefonu: ${admin.phone_number}`);
  console.log(`\n⚠️  WAŻNE: Zmień hasło po pierwszym logowaniu!`);

  await pool.end();
}

main().catch((e) => {
  console.error("❌ Błąd:", e.message);
  pool.end();
  process.exit(1);
});
