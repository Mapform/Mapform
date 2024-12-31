"server-only";

import { db } from "@mapform/db";
import {
  cells,
  datasets,
  iconsCells,
  layers,
  markerLayers,
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
import { DocumentContent } from "@mapform/blocknote";
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
        await db.transaction(async (tx) => {
          const [result] = await tx
            .select()
            .from(layers)
            .leftJoin(pointLayers, eq(layers.id, pointLayers.layerId))
            .leftJoin(markerLayers, eq(layers.id, markerLayers.layerId))
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

          if (layer.type !== "point" && layer.type !== "marker") {
            throw new Error("Layer is not a point or marker layer");
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

          const pointColumnId =
            layer.type === "point"
              ? result.point_layer?.pointColumnId
              : result.marker_layer?.pointColumnId;
          const titleColumnId =
            layer.type === "point"
              ? result.point_layer?.titleColumnId
              : result.marker_layer?.titleColumnId;
          const descriptionColumnId =
            layer.type === "point"
              ? result.point_layer?.descriptionColumnId
              : result.marker_layer?.descriptionColumnId;
          const iconColumnId =
            layer.type === "point"
              ? result.point_layer?.iconColumnId
              : result.marker_layer?.iconColumnId;

          if (!titleColumnId) {
            throw new Error("Layer does not have a title column");
          }

          if (!descriptionColumnId) {
            throw new Error("Layer does not have a description column");
          }

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

          const [titleCell, descriptionCell, pointCell, iconCell] = await tx
            .insert(cells)
            .values([
              {
                rowId: row.id,
                columnId: titleColumnId,
              },
              {
                rowId: row.id,
                columnId: descriptionColumnId,
              },
              {
                rowId: row.id,
                columnId: pointColumnId,
              },
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

          if (!titleCell || !descriptionCell || !pointCell) {
            throw new Error("Cells not created");
          }

          await tx.insert(stringCells).values({
            cellId: titleCell.id,
            value: title,
          });

          await tx.insert(richtextCells).values({
            cellId: descriptionCell.id,
            value: description as { content: DocumentContent },
          });

          await tx.insert(pointCells).values({
            cellId: pointCell.id,
            value: location,
          });

          if (iconCell) {
            await tx.insert(iconsCells).values({
              cellId: iconCell.id,
            });
          }
        });
      },
    );
