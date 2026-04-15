import { sql } from "drizzle-orm";
import { db } from "../src/db";

export async function clearDatabase() {
  const tables = ["sessions", "users"];
  
  for (const table of tables) {
    await db.execute(sql.raw(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`));
  }
}
