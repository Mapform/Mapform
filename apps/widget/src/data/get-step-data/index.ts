"server only";

import { prisma } from "@mapform/db";
import { estimateBounds } from "@mapform/map-utils/estimate-bounds";
import { action } from "~/lib/safe-action";
import { getStepDataSchema } from "./schema";

export type P = {
  id: number;
  longitude: number;
  latitude: number;
  zIndex: number;
}[];

export const getStepData = action
  .schema(getStepDataSchema)
  .action(async ({ parsedInput: { stepId } }) => {
    const step = await prisma.step.findUnique({
      where: {
        id: stepId,
        form: {
          isClosed: false,
          isRoot: false,
        },
      },
      include: {
        layers: {
          include: {
            pointLayer: true,
          },
        },
      },
    });

    if (!step) {
      throw new Error("Step not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- We do need a manual assertion here
    const stepLocation = (await prisma.$queryRaw`
      SELECT ST_X("Location".geom) AS longitude, ST_Y("Location".geom) AS latitude
      FROM "Location"
      WHERE "Location".id = ${step.locationId};
    `) as { longitude: number; latitude: number }[];

    const centerLatitude = stepLocation[0]?.latitude;
    const centerLongitude = stepLocation[0]?.longitude;

    if (!centerLatitude || !centerLongitude) {
      return [];
    }

    /**
     * We estimate the bounds rather than pass them from the client so that we
     * can show data on first render, instead of making a return request.
     */
    const estimatedBounds = estimateBounds(
      centerLatitude,
      centerLongitude,
      step.zoom,
      1000,
      1000
    );

    const resp: P[][] = await Promise.all(
      step.layers.map(
        async (layer) => prisma.$queryRaw`
        SELECT "Column".id, "PointCell".id, ST_X("PointCell".value) AS longitude, ST_Y("PointCell".value) AS latitude
        FROM "PointCell"
        JOIN "CellValue" ON "PointCell"."cellvalueid" = "CellValue".id
        JOIN "Column" ON "CellValue"."columnId" = "Column".id
        WHERE ST_Within(
          value,
          ST_MakeEnvelope(${estimatedBounds[0][1]}, ${estimatedBounds[0][0]}, ${estimatedBounds[1][1]}, ${estimatedBounds[1][0]}, 4326)
        )
        AND "Column".id = ${layer.pointLayer?.pointColumnId};
      `
      )
    );

    return resp.flat();
  });

export type GetStepData = NonNullable<Awaited<ReturnType<typeof getStepData>>>;

export type Points = GetStepData["data"];
