"server-only";

import { db } from "@mapform/db";
import {
  cells,
  datasets,
  iconsCells,
  layers,
  plans,
  pointCells,
  pointLayers,
  richtextCells,
  rows,
  stringCells,
  teamspaces,
  workspaces,
} from "@mapform/db/schema";
import { eq, and, inArray } from "@mapform/db/utils";
import { createPointSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import type { DocumentContent } from "@mapform/blocknote";
import { ServerError } from "../../../lib/server-error";
import { getRowAndPageCount } from "../../usage/get-row-and-page-count";

export const createPoint = (authClient: UserAuthClient) =>
  authClient
    .schema(createPointSchema)
    .action(
      async ({
        parsedInput: { layerId, title, description, location },
        ctx: { userAccess },
      }) => {
        return db.transaction(async (tx) => {
          const [result] = await tx
            .select()
            .from(layers)
            .leftJoin(pointLayers, eq(layers.id, pointLayers.layerId))
            .leftJoin(datasets, eq(layers.datasetId, datasets.id))
            .leftJoin(teamspaces, eq(datasets.teamspaceId, teamspaces.id))
            .leftJoin(workspaces, eq(teamspaces.workspaceSlug, workspaces.slug))
            .leftJoin(plans, eq(plans.workspaceSlug, workspaces.slug))
            .where(
              and(
                eq(layers.id, layerId),
                inArray(teamspaces.id, userAccess.teamspace.ids),
              ),
            );
          const layer = result?.layer;

          if (!layer) {
            throw new Error("Layer not found");
          }

          if (layer.type !== "point") {
            throw new Error("Layer is not a point layer");
          }

          if (!result.teamspace) {
            throw new Error("Teamspace not found");
          }

          if (!result.plan) {
            throw new Error("Plan not found");
          }

          const response = await getRowAndPageCount(authClient)({
            workspaceSlug: result.teamspace.workspaceSlug,
          });
          const rowCount = response?.data?.rowCount;
          const pageCount = response?.data?.pageCount;

          if (rowCount === undefined || pageCount === undefined) {
            throw new Error("Row count or page count is undefined.");
          }

          if (rowCount + pageCount >= result.plan.rowLimit) {
            throw new ServerError(
              "Row limit exceeded. Delete some rows, or upgrade your plan.",
            );
          }

          const pointColumnId = result.point_layer?.pointColumnId;
          const titleColumnId = result.layer.titleColumnId;
          const descriptionColumnId = result.layer.descriptionColumnId;
          const iconColumnId = result.layer.iconColumnId;

          if (!pointColumnId) {
            throw new Error("Layer does not have a point column");
          }

          const [row] = await tx
            .insert(rows)
            .values({
              datasetId: layer.datasetId,
            })
            .returning();

          if (!row) {
            throw new Error("Row not created");
          }

          const [pointCell, titleCell, descriptionCell, iconCell] = await tx
            .insert(cells)
            .values([
              {
                rowId: row.id,
                columnId: pointColumnId,
              },
              ...(titleColumnId
                ? [
                    {
                      rowId: row.id,
                      columnId: titleColumnId,
                    },
                  ]
                : []),
              ...(descriptionColumnId
                ? [
                    {
                      rowId: row.id,
                      columnId: descriptionColumnId,
                    },
                  ]
                : []),
              // If an icon column exists, create a cell for it, but we don't need to create an iconCell (just leave it empty)
              ...(iconColumnId
                ? [
                    {
                      rowId: row.id,
                      columnId: iconColumnId,
                    },
                  ]
                : []),
            ])
            .returning();

          if (!pointCell) {
            throw new Error("Cells not created");
          }

          await Promise.all(
            [
              tx.insert(pointCells).values({
                cellId: pointCell.id,
                value: location,
              }),
              titleCell &&
                tx.insert(stringCells).values({
                  cellId: titleCell.id,
                  value: title,
                }),
              descriptionCell &&
                tx.insert(richtextCells).values({
                  cellId: descriptionCell.id,
                  value: description as { content: DocumentContent },
                }),
              iconCell &&
                tx.insert(iconsCells).values({
                  cellId: iconCell.id,
                }),
            ].filter(Boolean),
          );

          return {
            row,
            layer,
            point_layer: result.point_layer,
          };
        });
      },
    );
