"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { pages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getPageSchema } from "./schema";

export const getPage = authAction
  .schema(getPageSchema)
  .action(async ({ parsedInput: { id } }) => {
    return db.query.pages.findFirst({
      where: eq(pages.id, id),
    });
  });

export type Page = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getPage>>>["data"]
>;
