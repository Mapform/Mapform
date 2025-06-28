"server-only";

import { db, sql } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import type { GeometryType, PointType } from "@mapform/db/schema/rows/schema";
import { getRowSchema } from "./schema";
import type { UnwrapReturn, UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";

export const getRow = (authClient: UserAuthClient) =>
  authClient
    .schema(getRowSchema)
    .action(async ({ parsedInput: { rowId }, ctx: { userAccess } }) => {
      // First get the rows with their teamspace information
      const row = await db.query.rows.findFirst({
        where: eq(rows.id, rowId),
        columns: {
          id: true,
          icon: true,
          name: true,
          description: true,
          geometry: true,
        },
        extras: {
          geometry: sql<GeometryType>`ST_AsGeoJSON(${rows.geometry})::jsonb`.as(
            "geometry",
          ),
          center:
            sql<PointType>`ST_AsGeoJSON(ST_Centroid(${rows.geometry}))::jsonb`.as(
              "center",
            ),
        },
        with: {
          project: true,
          cells: {
            with: {
              stringCell: true,
              numberCell: true,
              booleanCell: true,
              dateCell: true,
              column: true,
            },
          },
        },
      });

      if (!row) {
        throw new Error("Unauthorized");
      }

      if (!userAccess.teamspace.checkAccessById(row.project.teamspaceId)) {
        throw new Error("Unauthorized");
      }

      return row;
    });

export type GetRow = UnwrapReturn<typeof getRow>;
