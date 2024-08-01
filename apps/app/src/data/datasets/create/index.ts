"use server";

// eslint-disable-next-line import/named -- This is found. Not sure why it's being flagged
import { v4 as uuidv4 } from "uuid";
import { ColumnType, Prisma, prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createDatasetSchema } from "./schema";

export const createDataset = authAction
  .schema(createDatasetSchema)
  .action(async ({ parsedInput: { name, workspaceId, data } }) => {
    // Validate field types are consistent
    if (!validateFieldTypes(data)) {
      throw new Error("Field types are inconsistent");
    }

    const firstRow = data[0];

    if (!firstRow) {
      throw new Error("Dataset is empty");
    }

    /**
     * Generate UUIDs for each CellValue. This will allow us the match them later on
     */
    const dataWithModifiedCells = data.map((row) => {
      return Object.entries(row).map(([key, val]) => {
        const { type, value } = parseType(val);

        return {
          id: uuidv4(),
          key,
          type,
          value,
        };
      });
    });

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

      const dataset = await tx.dataset.update({
        where: {
          id: datasetWithCols.id,
        },
        data: {
          rows: {
            create: [
              ...dataWithModifiedCells.map((row) => ({
                cellValues: {
                  create: Object.values(row).map((cell) => {
                    return {
                      id: cell.id,
                      column: {
                        connect: {
                          datasetId_name: {
                            datasetId: datasetWithCols.id,
                            name: cell.key,
                          },
                        },
                      },
                    };
                  }),
                },
              })),
            ],
          },
        },
        include: {
          rows: {
            include: {
              cellValues: true,
            },
          },
          columns: true,
        },
      });

      const cells = dataWithModifiedCells.flatMap((row) => row);

      /**
       * Insert StringCells
       */
      const stringCells = cells.filter((cell) => cell.type === "STRING");
      const boolCells = cells.filter((cell) => cell.type === "BOOL");
      const pointCells = cells
        .filter((cell) => cell.type === "POINT")
        .map(
          (cell) =>
            Prisma.sql`(${uuidv4()}, ${cell.id}, ST_SetSRID(ST_MakePoint(${cell.value.coordinates[0]}, ${cell.value.coordinates[1]}), 4326))`
        );

      await Promise.all([
        /**
         * Insert StringCells
         */
        tx.stringCell.createMany({
          data: stringCells.map((cell) => ({
            cellValueId: cell.id,
            value: cell.value as string,
          })),
        }),

        /**
         * Insert BoolCells
         */
        tx.boolCell.createMany({
          data: boolCells.map((cell) => ({
            cellValueId: cell.id,
            value: cell.value as boolean,
          })),
        }),

        /**
         * Insert PointCells. Need to INSERT using raw SQL because Prisma does not support PostGIS
         */
        tx.$executeRaw`
          INSERT INTO "PointCell" (id, cellvalueid, value)
          VALUES ${Prisma.join(pointCells)};
        `,
      ]);

      return dataset;
    });

    revalidatePath("/");
  });

function validateFieldTypes(array: Record<string, any>[]) {
  if (array.length === 0) {
    return true; // Empty array is considered valid
  }

  const fieldTypes: Record<string, any> = {};

  // Initialize field types based on the first object
  for (const key in array[0]) {
    fieldTypes[key] = typeof array[0][key];
  }

  // Compare the types of the rest of the objects
  for (let i = 1; i < array.length; i++) {
    for (const key in array[i]) {
      if (typeof array[i]![key] !== fieldTypes[key]) {
        return false;
      }
    }
  }

  return true;
}

function parseType(val: string) {
  // Parse booleans
  if (val === "true" || val === "false") {
    return {
      type: ColumnType.BOOL,
      value: val === "true",
    };
  }

  // Parse GeoJSON Point
  try {
    const parsed = JSON.parse(val);
    if (
      parsed.type === "Point" &&
      Array.isArray(parsed.coordinates) &&
      parsed.coordinates.length === 2 &&
      typeof parsed.coordinates[0] === "number" &&
      typeof parsed.coordinates[1] === "number"
    ) {
      return {
        type: ColumnType.POINT,
        value: parsed,
      };
    }
  } catch (e) {
    // Ignore
  }

  /**
   * Treat all other values as strings
   */
  return {
    type: ColumnType.STRING,
    value: val,
  };
}
