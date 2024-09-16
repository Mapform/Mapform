"server-only";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { getStepDataSchema } from "./schema";

export type Points = {
  id: number;
  longitude: number;
  latitude: number;
  zIndex: number;
}[];

export const getStepData = authAction
  .schema(getStepDataSchema)
  .action(async ({ parsedInput: { stepId, bounds }, ctx: { userId } }) => {
    const step = await prisma.step.findUnique({
      where: {
        id: stepId,
        form: {
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

    const resp: Points[][] = await Promise.all(
      step.layers.map(
        async (layer) => prisma.$queryRaw`
        SELECT "Column".id, "GeometryCell".id, ST_X("GeometryCell".value) AS longitude, ST_Y("GeometryCell".value) AS latitude
        FROM "GeometryCell"
        JOIN "CellValue" ON "GeometryCell"."cellvalueid" = "CellValue".id
        JOIN "Column" ON "CellValue"."columnId" = "Column".id

        AND "Column".id = ${layer.pointLayer?.pointColumnId};
      `
      )
    );

    // WHERE ST_Within(
    //   value,
    //   ST_MakeEnvelope(${bounds.minLng}, ${bounds.minLat}, ${bounds.maxLng}, ${bounds.maxLat}, 4326)
    // )

    return resp.flat();
  });

export type GetStepData = NonNullable<
  Awaited<ReturnType<typeof getStepData>>
>["data"];
