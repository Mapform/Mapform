"server only";

import { prisma } from "@mapform/db";
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
  .action(async ({ parsedInput: { stepId, bounds } }) => {
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

    const resp: P[][] = await Promise.all(
      step.layers.map(
        async (layer) => prisma.$queryRaw`
        SELECT "Column".id, "PointCell".id, ST_X("PointCell".value) AS longitude, ST_Y("PointCell".value) AS latitude
        FROM "PointCell"
        JOIN "CellValue" ON "PointCell"."cellvalueid" = "CellValue".id
        JOIN "Column" ON "CellValue"."columnId" = "Column".id
        WHERE ST_Within(
          value,
          ST_MakeEnvelope(${bounds?.minLng}, ${bounds?.minLat}, ${bounds?.maxLng}, ${bounds?.maxLat}, 4326)
        )
        AND "Column".id = ${layer.pointLayer?.pointColumnId};
      `
      )
    );

    return resp.flat();
  });

export type GetStepData = NonNullable<Awaited<ReturnType<typeof getStepData>>>;

export type Points = GetStepData["data"];
