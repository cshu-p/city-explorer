import bcrypt from "bcrypt";
import { pool } from "../db";
import "dotenv/config";

type Row = { id: number; password: string | null; password_hash: string | null };

async function main() {
  // Fetch user_table that still need migration
  const res = await pool.query<Row>(
    `SELECT id, password, password_hash FROM user_table WHERE password_hash IS NULL`
  );

  console.log(`Need to migrate: ${res.rows.length}`);

  for (const u of res.rows) {
    if (!u.password) {
      console.warn(`User ${u.id} has NULL password; skipping`);
      continue;
    }

    // If it already looks like bcrypt, you can skip (extra safety)
    if (u.password.startsWith("$2a$") || u.password.startsWith("$2b$") || u.password.startsWith("$2y$")) {
      await pool.query(`UPDATE user_table SET password_hash = $1 WHERE id = $2`, [u.password, u.id]);
      console.log(`User ${u.id}: copied existing bcrypt hash`);
      continue;
    }

    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(`UPDATE user_table SET password_hash = $1 WHERE id = $2`, [hash, u.id]);
    console.log(`User ${u.id}: migrated`);
  }

  console.log("Done.");
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
