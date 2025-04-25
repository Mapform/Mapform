"server-only";

import { db } from "@mapform/db";
import {
  cells,
  datasets,
  iconsCells,
  layers,
  lineCells,
  lineLayers,
  plans,
  richtextCells,
  rows,
  stringCells,
  teamspaces,
  workspaces,
} from "@mapform/db/schema";
import { eq, and, inArray } from "@mapform/db/utils";
import { createLineSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import type { DocumentContent } from "@mapform/blocknote";
import { ServerError } from "../../../lib/server-error";
import { getRowAndPageCount } from "../../usage/get-row-and-page-count";

export const createLine = (authClient: UserAuthClient) =>
  authClient
    .schema(createLineSchema)
    .action(
      async ({
        parsedInput: { layerId, title, description, value },
        ctx: { userAccess },
      }) => {
        return db.transaction(async (tx) => {
          const [result] = await tx
            .select()
            .from(layers)
            .leftJoin(lineLayers, eq(layers.id, lineLayers.layerId))
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

          if (layer.type !== "line") {
            throw new Error("Layer is not a line layer");
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

          const lineColumnId = result.line_layer?.lineColumnId;
          const titleColumnId = layer.titleColumnId;
          const descriptionColumnId = layer.descriptionColumnId;
          const iconColumnId = layer.iconColumnId;

          if (!lineColumnId) {
            throw new Error("Layer does not have a line column");
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

          const [lineCell, titleCell, descriptionCell, iconCell] = await tx
            .insert(cells)
            .values([
              {
                rowId: row.id,
                columnId: lineColumnId,
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

          if (!lineCell) {
            throw new Error("Cells not created");
          }

          await Promise.all(
            [
              tx.insert(lineCells).values({
                cellId: lineCell.id,
                value,
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
            line_layer: result.line_layer,
          };
        });
      },
    );
