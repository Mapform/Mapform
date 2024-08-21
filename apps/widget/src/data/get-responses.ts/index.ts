"server-only";

import { type PointCell, prisma } from "@mapform/db";

export type PointCellResponse = PointCell & {
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
              pointCell: true,
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
      if (cellValue.pointCell) {
        const pointCell = await getPointCell(cellValue.pointCell.id);

        return {
          ...cellValue,
          pointCell,
        };
      }

      return cellValue;
    }) ?? []
  );

  return responses;
}

async function getPointCell(pointCellId: string) {
  // Make raw query to get LocationResponse with Location lat lng
  const pointCellResponse: PointCellResponse[] = await prisma.$queryRaw`
    SELECT DISTINCT "PointCell".*, ST_X("PointCell".value) AS longitude, ST_Y("PointCell".value) AS latitude
    FROM "PointCell"
    WHERE "PointCell"."id" = ${pointCellId};
  `;

  const formattedResponse = pointCellResponse[0]
    ? {
        ...pointCellResponse[0],
        value: {
          latitude: pointCellResponse[0].latitude,
          longitude: pointCellResponse[0].longitude,
        },
      }
    : null;

  return formattedResponse;
}

export type Responses = Awaited<ReturnType<typeof getResponses>>;
