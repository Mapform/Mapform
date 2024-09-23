"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { pages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getPageWithDataSchema } from "./schema";

export const getPageWithData = authAction
  .schema(getPageWithDataSchema)
  .action(async ({ parsedInput: { id } }) => {
    return db.query.pages.findFirst({
      where: eq(pages.id, id),
      with: {
        layersToPages: {
          with: {
            layer: true,
          },
          orderBy: (layerToPage, { asc }) => [asc(layerToPage.position)],
        },
      },
    });
  });

export type PageWithData = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getPageWithData>>>["data"]
>;
