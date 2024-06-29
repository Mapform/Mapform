import { Prisma, Dataset } from "@prisma/client";

/**
 * Prisma does not yet natively support PostGIS
 * So, to use PostGIS with Prisma, we need to extend the Prisma client
 */
export function datasetsExtension() {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      name: "Datasets",
      model: {
        dataset: {
          findMany: async ({ formId }: { formId: string }) => {
            // const steps = (await prisma.$queryRaw`
            //   SELECT "Step".*, ST_X("Location".geom) AS longitude, ST_Y("Location".geom) AS latitude
            //   FROM "Step"
            //   LEFT JOIN "Location" ON "Step"."locationId" = "Location".id
            //   WHERE "Step"."formId" = ${formId};
            // `) as StepWithLocation[];
            // const form = await prisma.form.findUnique({
            //   where: {
            //     id: formId,
            //   },
            //   select: {
            //     stepOrder: true,
            //   },
            // });
            // if (!form) {
            //   throw new Error("Form not found");
            // }
            // // Order the steps according to the form's stepOrder
            // const orderedSteps = form.stepOrder
            //   .map((id) => {
            //     return steps.find((step) => step.id === id);
            //   })
            //   .filter((s) => Boolean(s)) as StepWithLocation[];
            // return orderedSteps;
          },
        },
      },
    })
  );
}
