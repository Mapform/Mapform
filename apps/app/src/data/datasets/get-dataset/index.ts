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
                pointCell: true,
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
    const pointCellsWithLocation = (await prisma.$queryRaw`
      SELECT "PointCell".id, ST_X("PointCell".value) AS longitude, ST_Y("PointCell".value) AS latitude
      FROM "PointCell"
      JOIN "CellValue" ON "PointCell"."cellvalueid" = "CellValue".id
      JOIN "Row" ON "CellValue"."rowId" = "Row".id
      JOIN "Dataset" ON "Row"."datasetId" = "Dataset".id
      WHERE "Dataset".id = ${datasetId};
    `) as { id: string; longitude: string; latitude: string }[];

    // Combine the pointCell data with the form data
    const combined = dataset.rows.map((row) => {
      const formSubmission = row.formSubmission;
      const cellValues = row.cellValues.map((cellValue) => {
        const pointCell = pointCellsWithLocation.find(
          (pc) => pc.id === cellValue.pointCell?.id
        );

        return {
          ...cellValue,
          pointCell: pointCell
            ? {
                ...cellValue.pointCell,
                value: `${pointCell.longitude},${pointCell.latitude}`,
              }
            : cellValue.pointCell,
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
