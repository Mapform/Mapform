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
            "formOfDraftStep" | "formOfPublishedStep" | "location" | "order"
          > & {
            latitude: number;
            longitude: number;
            formId: string;
          }) => {
            const locationId = v4();

            return prisma.$transaction(async (tx) => {
              const stepCount = await tx.step.count({
                where: {
                  formOfDraftStepId: formId,
                },
              });

              await tx.$queryRaw`
                INSERT INTO "Location" (geom, id)
                VALUES(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326), ${locationId})
              `;

              return tx.step.create({
                data: {
                  ...args,
                  order: stepCount + 1,
                  formOfDraftStepId: formId,
                  formOfPublishedStepId: formId,
                  locationId,
                },
              });
            });
          },

          /**
           * Delete the step with the associated location
           */
          deleteWithLocation: async ({
            stepId,
          }: {
            stepId: string;
          }): Promise<any> => {
            const step = await prisma.step.findUnique({
              where: {
                id: stepId,
              },
            });

            if (!step) {
              throw new Error("Step not found");
            }

            return prisma.$transaction([
              prisma.$queryRaw`DELETE FROM "Step" WHERE id = ${stepId};`,
              prisma.$queryRaw`DELETE FROM "Location" WHERE id = ${step.locationId}`,
            ]);
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
              WHERE "Step"."formOfDraftStepId" = ${formId}
              ORDER BY "Step"."order" ASC;
            `;
          },
        },
      },
    })
  );
}
