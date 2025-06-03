"server-only";

import { db } from "@mapform/db";
import { layersToPages, pages } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { getPageWithLayersSchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const getPageWithLayers = (authClient: UserAuthClient) =>
  authClient
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
              lineLayer: true,
              polygonLayer: true,
            },
          },
        },
        orderBy: (ltp, { asc }) => [asc(ltp.position)],
      });

      return {
        ...page,
        layersToPages: ltp,
      };
    });

export type GetPageWithLayers = UnwrapReturn<typeof getPageWithLayers>;
