"use server";

import { type PointLayer, prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { getLayerDataSchema } from "./schema";

export type Points = { id: number; longitude: number; latitude: number }[];

export const getLayerData = authAction
  .schema(getLayerDataSchema)
  .action(async ({ parsedInput: { dataTrackId, bounds } }) => {
    const dataTrack = await prisma.dataTrack.findUnique({
      where: {
        id: dataTrackId,
      },
      include: {
        layer: {
          include: {
            pointLayer: true,
          },
        },
      },
    });

    if (!dataTrack) {
      return undefined;
    }

    const pointLayer = dataTrack.layer?.pointLayer as PointLayer;

    const points: Points = await prisma.$queryRaw`
          SELECT "Column".id, "PointCell".id, ST_X("PointCell".value) AS longitude, ST_Y("PointCell".value) AS latitude
          FROM "PointCell"
          JOIN "CellValue" ON "PointCell"."cellvalueid" = "CellValue".id
          JOIN "Column" ON "CellValue"."columnId" = "Column".id
          WHERE ST_Within(
            value,
            ST_MakeEnvelope(${bounds.minLng}, ${bounds.minLat}, ${bounds.maxLng}, ${bounds.maxLat}, 4326)
          )
          AND "Column".id = ${pointLayer.pointColumnId};
        `;

    return {
      points,
    };
  });
