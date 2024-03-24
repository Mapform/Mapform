import { type PrismaClient } from "@prisma/client";
import { v4 } from "uuid";

export function extendWithLocations<T extends PrismaClient>(prisma: T) {
  return prisma.$extends({
    name: "Locations",
    model: {
      step: {
        createWithLocation: async (args) => {
          const locationId = v4();
          const stepLocation = await prisma.$queryRaw`
            INSERT INTO "Location" (geom, id)
            VALUES(ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326), ${locationId})
          `;

          return prisma.step.create({
            data: {
              ...args,
              locationId,
            },
          });
        },
      },
    },
  });
}
