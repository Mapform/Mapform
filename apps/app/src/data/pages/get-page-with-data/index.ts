"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { layersToPages, pages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getPageWithDataSchema } from "./schema";

export const getPageWithData = authAction
  .schema(getPageWithDataSchema)
  .action(async ({ parsedInput: { id } }) => {
    // TODO: Cannot use 'with' with geometry columns currently due to Drizzle bug: https://github.com/drizzle-team/drizzle-orm/issues/2526
    // Once fix is merged we can simplify this
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, id),
    });

    const ltp = await db.query.layersToPages.findMany({
      where: eq(layersToPages.pageId, id),
      with: {
        layer: true,
      },
    });

    return {
      ...page,
      layersToPages: ltp,
    };
  });

export type PageWithData = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getPageWithData>>>["data"]
>;
