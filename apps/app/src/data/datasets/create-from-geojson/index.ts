"use server";

// eslint-disable-next-line import/named -- This is found. Not sure why it's being flagged
import { ColumnType, Prisma, prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { authAction } from "~/lib/safe-action";
import { createDatasetFromGeojsonSchema } from "./schema";

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
              type: typeof val,
              value: val,
            };
          }
        );

        const geometryWithId = {
          id: uuidv4(),
          key: "geometry",
          type: "GEOMETRY",
          value: geometry,
        };

        return [...propertiesWithId, geometryWithId];
      });

      // Group cells by key
      const groupedCells = cells.reduce((acc, cell) => {
        if (!acc[cell.key]) {
          acc[cell.key] = [];
        }

        acc[cell.key].push(cell);

        return acc;
      }, {});

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
                ...Object.entries(firstRow).map(([key, val]) => ({
                  name: key,
                  dataType: parseType(val).type,
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

function parseType(val: string) {
  const valType = typeof val;
  // Parse booleans
  if (valType === "boolean") {
    return {
      type: ColumnType.BOOL,
      value: val,
    };
  }

  if (valType === "number") {
    return {
      type: ColumnType.NUMBER,
      value: val,
    };
  }

  /**
   * Treat all other values as strings
   */
  return {
    type: ColumnType.STRING,
    value: val,
  };
}
