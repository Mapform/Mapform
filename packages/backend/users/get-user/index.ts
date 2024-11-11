"server-only";

import { db } from "@mapform/db";
import { users } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import type { GetUserSchema } from "./schema";

export const getUser = async ({ id }: GetUserSchema) =>
  db.query.users.findFirst({
    where: eq(users.id, id),
  });

export type GetUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;
