"server-only";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { getDatasetSchema } from "./schema";

export const getDataset = authAction
  .schema(getDatasetSchema)
  .action(async ({ parsedInput: { datasetId }, ctx: { userId } }) => {
    const dataset = await prisma.dataset.findUnique({
      where: {
        id: datasetId,
        workspace: {
          organization: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
      },
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
        columns: true,
        rows: {
          include: {
            formSubmission: true,
            cellValues: {
              include: {
                boolCell: true,
                geometryCell: true,
                stringCell: true,
              },
            },
          },
        },
      },
    });

    if (!dataset) {
      throw new Error("Dataset not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- It is necessary
    const geometryCellsWithLocation = (await prisma.$queryRaw`
      SELECT "GeometryCell".id, ST_X("GeometryCell".value) AS longitude, ST_Y("GeometryCell".value) AS latitude
      FROM "GeometryCell"
      JOIN "CellValue" ON "GeometryCell"."cellvalueid" = "CellValue".id
      JOIN "Row" ON "CellValue"."rowId" = "Row".id
      JOIN "Dataset" ON "Row"."datasetId" = "Dataset".id
      WHERE "Dataset".id = ${datasetId};
    `) as { id: string; longitude: string; latitude: string }[];

    // Combine the geometryCell data with the form data
    const combined = dataset.rows.map((row) => {
      const formSubmission = row.formSubmission;
      const cellValues = row.cellValues.map((cellValue) => {
        const geometryCell = geometryCellsWithLocation.find(
          (pc) => pc.id === cellValue.geometryCell?.id
        );

        return {
          ...cellValue,
          geometryCell: geometryCell
            ? {
                ...cellValue.geometryCell,
                value: `${geometryCell.longitude},${geometryCell.latitude}`,
              }
            : cellValue.geometryCell,
        };
      });

      return {
        ...row,
        formSubmission,
        cellValues,
      };
    });

    return {
      ...dataset,
      rows: combined,
    };
  });
