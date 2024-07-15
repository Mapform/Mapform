import { prisma } from "@mapform/db";

export async function getForm(formId: string) {
  return prisma.form.findUnique({
    where: {
      id: formId,
    },
    include: {
      _count: {
        select: { formVersions: true },
      },
    },
  });
}

export async function getNearbyPoints() {
  // await prisma.$queryRaw`
  //   SELECT "LocationResponse".*, ST_X("Location".geom) AS longitude, ST_Y("Location".geom) AS latitude
  //   FROM "LocationResponse"
  //   JOIN "Location" ON "LocationResponse"."locationId" = "Location".id
  //   WHERE "LocationResponse"."id" = ANY(${locationResponseIds});
  // `;

  /**
   * Retrieve all points within a bounding box for the given point column
   */
  const x = await prisma.$queryRaw`
    SELECT "Column".id, "PointCell".id, ST_X("PointCell".value) AS longitude, ST_Y("PointCell".value) AS latitude
    FROM "PointCell"
    JOIN "CellValue" ON "PointCell"."cellvalueid" = "CellValue".id
    JOIN "Column" ON "CellValue"."columnId" = "Column".id
    -- WHERE "Column".id = "9af5d58b-64fe-451a-b972-5de6b9447b80";
    -- WHERE ST_Within(
    --   value,
    --   -- minLng, maxLng, minLat, maxLat
    --   ST_MakeEnvelope(-74.1, -73.9, 40.7, 40.8, 4326)
    -- );
  `;

  console.log(x);
}

export type Form = NonNullable<Awaited<ReturnType<typeof getForm>>>;
