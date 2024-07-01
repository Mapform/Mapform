"use server";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { getPointDataSchema } from "./schema";

export const getPointData = authAction(
  getPointDataSchema,
  async ({ pointLayerId, bounds }) => {
    const pointLayer = await prisma.pointLayer.findUnique({
      where: {
        id: pointLayerId,
      },
      include: {
        pointColumn: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!pointLayer) {
      return [];
    }

    const points = await prisma.$queryRaw`
      SELECT "Column".id, "PointCell".id, ST_X("PointCell".value) AS longitude, ST_Y("PointCell".value) AS latitude
      FROM "PointCell"
      JOIN "CellValue" ON "PointCell"."cellvalueid" = "CellValue".id
      JOIN "Column" ON "CellValue"."columnId" = "Column".id
      WHERE "Column".id = ${pointLayer.pointColumn.id}
      AND ST_Within(
        value,
        -- minLng, maxLng, minLat, maxLat
        ST_MakeEnvelope(${bounds.minLng}, ${bounds.maxLng}, ${bounds.minLat}, ${bounds.maxLat}, 4326)
      );
    `;

    return points;
  }
);
