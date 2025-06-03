import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { env } from "../env.mjs";
import * as schema from "../schema";
import { cells, lineCells } from "../schema";
import { sql } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool, { schema });

async function runDataMigration() {
  await db.transaction(async (tx) => {
    const rowId = "2c0a192b-07a8-44e3-ad44-fd0635018495";
    const columnId = "f7da3afa-a9ee-46ae-9e45-6587b5868eff";

    const [cell] = await tx
      .insert(cells)
      .values({
        rowId,
        columnId,
      })
      .onConflictDoUpdate({
        target: [cells.rowId, cells.columnId],
        set: { updatedAt: new Date() },
      })
      .returning();

    if (!cell) {
      throw new Error("Cell not found");
    }

    await tx.insert(lineCells).values({
      cellId: cell.id,
      value: sql.raw(`ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
          [-85.3368669, 53.3933335],
          [-84.0185075, 53.9853397]
        ]
      }')`),
    });
  });
}

runDataMigration()
  .then(() => {
    console.log("Migration finished successfully");
    process.exit(0); // Exit the process when done
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1); // Exit with error status
  });
