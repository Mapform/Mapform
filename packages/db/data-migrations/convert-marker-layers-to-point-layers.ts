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
    const savedMarkerLayers = await tx.query.layers.findMany({
      where: eq(layers.type, "marker"),
      with: {
        markerLayer: true,
      },
    });

    for (const layer of savedMarkerLayers) {
      await tx
        .insert(pointLayers)
        .values({
          layerId: layer.id,
          pointColumnId: layer.markerLayer?.pointColumnId,
          color: layer.markerLayer?.color,
          iconColumnId: layer.markerLayer?.iconColumnId,
          titleColumnId: layer.markerLayer?.titleColumnId,
          descriptionColumnId: layer.markerLayer?.descriptionColumnId,
        })
        .onConflictDoUpdate({
          target: [pointLayers.layerId],
          set: {
            pointColumnId: layer.markerLayer?.pointColumnId,
            color: layer.markerLayer?.color,
            iconColumnId: layer.markerLayer?.iconColumnId,
            titleColumnId: layer.markerLayer?.titleColumnId,
            descriptionColumnId: layer.markerLayer?.descriptionColumnId,
          },
        });

      await tx.delete(markerLayers).where(eq(markerLayers.layerId, layer.id));

      await tx
        .update(layers)
        .set({
          type: "point",
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
