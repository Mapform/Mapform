"use server";

// eslint-disable-next-line import/named -- This is found. Not sure why it's being flagged
import { z } from "zod";
import { ColumnType, prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { authAction } from "~/lib/safe-action";
import { createDatasetFromGeojsonSchema } from "./schema";
import { parseType } from "./parse-type";

export const createDatasetFromGeojson = authAction
  .schema(createDatasetFromGeojsonSchema)
  .action(async ({ parsedInput: { name, workspaceId, data } }) => {
    if (data.type === "FeatureCollection") {
      const rows = data.features;

      const cells = rows.flatMap((row) => {
        const properties = row.properties;
        const geometry = row.geometry;

        if (!properties || !geometry) {
          throw new Error("Feature is missing properties or geometry");
        }

        const propertiesWithId = Object.entries(properties).map(
          ([key, val]) => {
            return {
              id: uuidv4(),
              key,
              type: parseType(val as unknown).type,
              value: val,
            };
          }
        );

        const geometryWithId = {
          id: uuidv4(),
          key: "geometry",
          type: ColumnType.GEOMETRY,
          value: geometry,
        };

        return [...propertiesWithId, geometryWithId];
      });

      // Group cells by key
      const groupedCells = cells.reduce(
        (acc, current) => {
          const identifier = `${current.type}-${current.key}`; // Create a unique identifier

          if (!acc.set.has(identifier)) {
            acc.set.add(identifier); // Track this combination
            acc.result.push(current); // Add object to the result array
          }

          return acc;
        },
        { set: new Set(), result: [] }
      ).result;

      await prisma.$transaction(async (tx) => {
        const datasetWithCols = await tx.dataset.create({
          data: {
            name,
            workspace: {
              connect: {
                id: workspaceId,
              },
            },
            columns: {
              create: [
                ...groupedCells.map((cell) => ({
                  name: cell.key,
                  dataType: cell.type,
                })),
              ],
            },
          },
          include: {
            columns: true,
          },
        });
      });
    }
  });
