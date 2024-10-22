"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { layersToPages, pages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getPageWithLayersSchema } from "./schema";

export const getPageWithLayers = authAction
  .schema(getPageWithLayersSchema)
  .action(async ({ parsedInput: { id } }) => {
    // TODO: Cannot use 'with' with geometry columns currently due to Drizzle bug: https://github.com/drizzle-team/drizzle-orm/issues/2526
    // Once fix is merged we can simplify this
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, id),
    });

    if (!page) {
      throw new Error("Page not found");
    }

    const ltp = await db.query.layersToPages.findMany({
      where: eq(layersToPages.pageId, id),
      with: {
        layer: {
          with: {
            pointLayer: true,
          },
        },
      },
    });

    return {
      ...page,
      layersToPages: ltp,
    };
  });

export type PageWithLayers = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getPageWithLayers>>>["data"]
>;
