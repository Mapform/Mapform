"use server";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { getPointDataSchema } from "./schema";

export type Points = { id: number; longitude: number; latitude: number }[];

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
      return undefined;
    }

    const points: Points = await prisma.$queryRaw`
      SELECT "Column".id, "PointCell".id, ST_X("PointCell".value) AS longitude, ST_Y("PointCell".value) AS latitude
      FROM "PointCell"
      JOIN "CellValue" ON "PointCell"."cellvalueid" = "CellValue".id
      JOIN "Column" ON "CellValue"."columnId" = "Column".id
      WHERE ST_Within(
        value,
        ST_MakeEnvelope(${bounds.minLng}, ${bounds.minLat}, ${bounds.maxLng}, ${bounds.maxLat}, 4326)
      )
      AND "Column".id = ${pointLayer.pointColumn.id};
    `;

    return {
      pointLayerId,
      layerName: pointLayer.layerId,
      points,
    };
  }
);
