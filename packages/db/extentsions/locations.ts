import { Prisma, type PrismaClient } from "@prisma/client";
import { v4 } from "uuid";

/**
 * Prisma does not yet natively support PostGIS
 * So, to use PostGIS with Prisma, we need to extend the Prisma client
 */
export function extendWithLocations<T extends PrismaClient>(prisma: T) {
  return prisma.$extends({
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
          "draftedForm" | "publishedForm" | "location"
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
                draftedFormId: formId,
                publishedFormId: formId,
                locationId,
              },
            }),
          ]);

          return step;
        },
      },
    },
  });
}
