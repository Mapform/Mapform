import { type LocationResponse, prisma } from "@mapform/db";

export async function getFormSubmissions({ formId }: { formId: string }) {
  const submissions = await prisma.formSubmission.findMany({
    where: {
      form: {
        rootForm: {
          id: formId,
        },
      },
    },
    include: {
      inputResponses: {
        include: {
          step: {
            select: {
              id: true,
            },
          },
        },
      },
      locationResponses: {
        include: {
          step: {
            select: {
              id: true,
            },
          },
        },
      },
      form: {
        include: {
          steps: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const locationResponseIds = submissions.flatMap((fs) =>
    fs.locationResponses.map((lr) => lr.id)
  );

  const locations: (LocationResponse & {
    latitude: number;
    longitude: number;
  })[] = await prisma.$queryRaw`
    SELECT "LocationResponse".*, ST_X("Location".geom) AS longitude, ST_Y("Location".geom) AS latitude
    FROM "LocationResponse"
    JOIN "Location" ON "LocationResponse"."locationId" = "Location".id
    WHERE "LocationResponse"."id" = ANY(${locationResponseIds});
  `;

  // Merge data
  return submissions.map((submission) => {
    return {
      ...submission,
      locationResponses: submission.locationResponses.map((lr) => {
        const location = locations.find((l) => l.id === lr.id);
        return {
          ...lr,
          location: {
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
        };
      }),
    };
  });
}

export type FormSubmissions = NonNullable<
  Awaited<ReturnType<typeof getFormSubmissions>>
>;
