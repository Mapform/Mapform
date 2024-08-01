"use server";

import { type PointLayer, prisma } from "@mapform/db";
import { action } from "~/lib/safe-action";
import { getLayerDataSchema } from "./schema";

export type Points = { id: number; longitude: number; latitude: number }[];

export const getLayerData = action
  .schema(getLayerDataSchema)
  .action(async ({ parsedInput: { dataTrackId, bounds } }) => {
    const dataTrack = await prisma.dataTrack.findUnique({
      where: {
        id: dataTrackId,
      },
      include: {
        layers: {
          include: {
            pointLayer: true,
          },
        },
      },
    });

    if (!dataTrack) {
      return undefined;
    }

    const pointLayers = dataTrack.layers
      .map((layer) => layer.pointLayer)
      .filter(Boolean) as PointLayer[];

    const points = (
      await Promise.all(
        pointLayers.map(async (pointLayer) => {
          return prisma.$queryRaw`
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
        })
      )
    ).flat() as Points;

    return {
      points,
    };
  });
