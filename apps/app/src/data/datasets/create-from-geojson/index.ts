"use server";

import { ColumnType, Prisma, prisma } from "@mapform/db";
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

      const dataWithModifiedCells = rows.flatMap((row) => {
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
      const groupedCells = dataWithModifiedCells.reduce(
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
         * Insert cells
         */
        const stringCells = cells.filter((cell) => cell.type === "STRING");
        const boolCells = cells.filter((cell) => cell.type === "BOOL");
        const floatCells = cells.filter((cell) => cell.type === "FLOAT");
        const intCells = cells.filter((cell) => cell.type === "INT");
        const dateCells = cells.filter((cell) => cell.type === "DATE");
        const geometryCells = cells
          .filter((cell) => cell.type === "GEOMETRY")
          .map(
            (cell) =>
              Prisma.sql`(${uuidv4()}, ${cell.id}, ST_GeomFromGeoJSON('{
                  "type": ${cell.value.type},
                  "coordinates": ${cell.value.coordinates}
              }')`
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
           * Insert FloatCells
           */
          tx.floatCell.createMany({
            data: floatCells.map((cell) => ({
              cellValueId: cell.id,
              value: cell.value as number,
            })),
          }),

          /**
           * Insert IntCells
           */
          tx.intCell.createMany({
            data: intCells.map((cell) => ({
              cellValueId: cell.id,
              value: cell.value as number,
            })),
          }),

          /**
           * Insert DateCells
           */
          tx.dateCell.createMany({
            data: dateCells.map((cell) => ({
              cellValueId: cell.id,
              value: cell.value as Date,
            })),
          }),

          /**
           * Insert GeometryCells. Need to INSERT using raw SQL because Prisma does not support PostGIS
           */
          tx.$executeRaw`
          INSERT INTO "GeometryCell" (id, cellvalueid, value)
          VALUES ${Prisma.join(geometryCells)};
        `,
        ]);

        return dataset;
      });
    }
  });
