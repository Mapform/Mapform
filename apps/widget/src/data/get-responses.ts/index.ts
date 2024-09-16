"server-only";

import { type GeometryCell, prisma } from "@mapform/db";

export type GeometryCellResponse = GeometryCell & {
  latitude: number;
  longitude: number;
};

/**
 * Returns a session's previous responses
 */
export async function getResponses(formSubmissionId: string) {
  const formSubmission = await prisma.formSubmission.findUnique({
    where: {
      id: formSubmissionId,
    },
    include: {
      row: {
        include: {
          cellValues: {
            include: {
              column: true,
              boolCell: true,
              geometryCell: true,
              stringCell: true,
            },
          },
        },
      },
    },
  });

  // Backfill location-based responses since Prisma doesn't support them
  const responses = await Promise.all(
    formSubmission?.row.cellValues.map(async (cellValue) => {
      if (cellValue.geometryCell) {
        const geometryCell = await getGeomtryCell(cellValue.geometryCell.id);

        return {
          ...cellValue,
          geometryCell,
        };
      }

      return cellValue;
    }) ?? []
  );

  return responses;
}

async function getGeomtryCell(geometryCellId: string) {
  // Make raw query to get LocationResponse with Location lat lng
  const geometryCellResponse: GeometryCellResponse[] = await prisma.$queryRaw`
    SELECT DISTINCT "GeometryCell".*, ST_X("GeometryCell".value) AS longitude, ST_Y("GeometryCell".value) AS latitude
    FROM "GeometryCell"
    WHERE "GeometryCell"."id" = ${geometryCellId};
  `;

  const formattedResponse = geometryCellResponse[0]
    ? {
        ...geometryCellResponse[0],
        value: {
          latitude: geometryCellResponse[0].latitude,
          longitude: geometryCellResponse[0].longitude,
        },
      }
    : null;

  return formattedResponse;
}

export type Responses = Awaited<ReturnType<typeof getResponses>>;
