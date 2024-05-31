import { Prisma, Step } from "@prisma/client";
import { v4 } from "uuid";

type StepWithLocation = Step & {
  latitude: number;
  longitude: number;
  description: {
    content: any[];
  };
};

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
          }: Omit<Prisma.StepCreateInput, "form" | "location" | "order"> & {
            latitude: number;
            longitude: number;
            formId: string;
          }) => {
            const locationId = v4();

            return prisma.$transaction(async (tx) => {
              await tx.$queryRaw`
                INSERT INTO "Location" (geom, id)
                VALUES(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326), ${locationId})
              `;

              const newStep = await tx.step.create({
                data: {
                  ...args,
                  formId,
                  locationId,
                },
              });

              const currentStepOrder = await tx.form.findUnique({
                where: {
                  id: formId,
                },
                select: {
                  stepOrder: true,
                },
              });

              if (!currentStepOrder) {
                throw new Error("Form not found");
              }

              await tx.form.update({
                where: {
                  id: formId,
                },
                data: {
                  stepOrder: {
                    set: [...currentStepOrder.stepOrder, newStep.id],
                  },
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

            if (!step?.formId) {
              throw new Error("Step not found");
            }

            return prisma.$transaction(async (tx) => {
              await tx.$queryRaw`DELETE FROM "Step" WHERE id = ${stepId};`;
              await tx.$queryRaw`DELETE FROM "Location" WHERE id = ${step.locationId}`;

              const currentStepOrder = await tx.form.findUnique({
                where: {
                  id: step.formId!,
                },
                select: {
                  stepOrder: true,
                },
              });

              if (!currentStepOrder) {
                throw new Error("Form not found");
              }

              await tx.form.update({
                where: {
                  id: step.formId!,
                },
                data: {
                  stepOrder: {
                    set: currentStepOrder.stepOrder.filter(
                      (id) => id !== stepId
                    ),
                  },
                },
              });
            });
          },

          // Order by Form.stepOrder using WITH ORDINALITY
          findManyWithLocation: async ({ formId }: { formId: string }) => {
            const steps = (await prisma.$queryRaw`
              SELECT "Step".*, ST_X("Location".geom) AS longitude, ST_Y("Location".geom) AS latitude
              FROM "Step"
              LEFT JOIN "Location" ON "Step"."locationId" = "Location".id
              WHERE "Step"."formId" = ${formId};
            `) as StepWithLocation[];

            const form = await prisma.form.findUnique({
              where: {
                id: formId,
              },
              select: {
                stepOrder: true,
              },
            });

            if (!form) {
              throw new Error("Form not found");
            }

            // Order the steps according to the form's stepOrder
            const orderedSteps = form.stepOrder
              .map((id) => {
                return steps.find((step) => step.id === id);
              })
              .filter((s) => Boolean(s)) as StepWithLocation[];

            return orderedSteps;
          },
        },
      },
    })
  );
}
