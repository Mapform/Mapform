import { db } from "@mapform/db";
import { eq, sql } from "@mapform/db/utils";
import { rows, pointLayers, pointCells } from "@mapform/db/schema";
import { type SignUpSchema } from "./schema";

/**
 * Returns a single point (a row) from a point layer
 */
export const signUp = async ({ email }: SignUpSchema) => {};
