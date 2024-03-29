import { Prisma, Step } from "@prisma/client";
import { v4 } from "uuid";

/**
 * Prisma does not yet natively support PostGIS
 * So, to use PostGIS with Prisma, we need to extend the Prisma client
 */
export function stepsExtension() {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      name: "Locations",
      model: {
        step: {
          createWithLocation: async ({
            latitude,
            longitude,
            formId,
            ...args
          }: Omit<
            Prisma.StepCreateInput,
            "formOfDraftStep" | "formOfPublishedStep" | "location"
          > & {
            latitude: number;
            longitude: number;
            formId: string;
          }) => {
            const locationId = v4();
            const [_, step] = await prisma.$transaction([
              prisma.$queryRaw`
            INSERT INTO "Location" (geom, id)
            VALUES(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326), ${locationId})
          `,
              prisma.step.create({
                data: {
                  ...args,
                  formOfDraftStepId: formId,
                  formOfPublishedStepId: formId,
                  locationId,
                },
              }),
            ]);

            return step;
          },

          findManyWithLocation: async ({
            formId,
          }: {
            formId: string;
          }): Promise<(Step & { latitude: number; longitude: number })[]> => {
            return prisma.$queryRaw`
              SELECT "Step".*, ST_X("Location".geom) AS longitude, ST_Y("Location".geom) AS latitude
              FROM "Step"
              LEFT JOIN "Location" ON "Step"."locationId" = "Location".id
              WHERE "Step"."formOfDraftStepId" = ${formId};
            `;
          },
        },
      },
    })
  );
}
