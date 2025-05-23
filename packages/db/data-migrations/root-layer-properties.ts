import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { env } from "../env.mjs";
import * as schema from "../schema";
import { eq } from "drizzle-orm";
import { layers, markerLayers, pointLayers } from "../schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool, { schema });

async function runDataMigration() {
  await db.transaction(async (tx) => {
    const savedPointLayers = await tx.query.layers.findMany({
      where: eq(layers.type, "point"),
      with: {
        pointLayer: true,
      },
    });

    for (const layer of savedPointLayers) {
      await tx
        .update(pointLayers)
        .set({
          color: null,
          iconColumnId: null,
          titleColumnId: null,
          descriptionColumnId: null,
        })
        .where(eq(pointLayers.layerId, layer.id));

      await tx
        .update(layers)
        .set({
          color: layer.pointLayer?.color ?? null,
          iconColumnId: layer.pointLayer?.iconColumnId ?? null,
          titleColumnId: layer.pointLayer?.titleColumnId ?? null,
          descriptionColumnId: layer.pointLayer?.descriptionColumnId ?? null,
        })
        .where(eq(layers.id, layer.id));
    }

    console.log("Data migration completed!");
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
