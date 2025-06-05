"server-only";

import { db } from "@mapform/db";
import { eq, sql, and, inArray } from "@mapform/db/utils";
import { getDatasetSchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";
import {
  datasets,
  lineCells,
  pointCells,
  polygonCells,
} from "@mapform/db/schema";
import * as wellknown from "wellknown";
import type { LineString, Polygon } from "geojson";

// Define types for cells with geometry
type LineCellWithGeometry = {
  id: string;
  coordinates: string;
  geometry: LineString;
};

type PolygonCellWithGeometry = {
  id: string;
  coordinates: string;
  geometry: Polygon;
};

export const getDataset = (authClient: UserAuthClient) =>
  authClient
    .schema(getDatasetSchema)
    .action(async ({ parsedInput: { datasetId }, ctx: { userAccess } }) => {
      const dataset = await db.query.datasets.findFirst({
        where: and(
          eq(datasets.id, datasetId),
          inArray(datasets.teamspaceId, userAccess.teamspace.ids),
        ),
        with: {
          columns: true,
          project: {
            columns: {
              id: true,
              name: true,
            },
          },
          rows: {
            orderBy: (rows, { asc }) => [asc(rows.createdAt)],
            with: {
              formSubmission: true,
              cells: {
                with: {
                  stringCell: true,
                  booleanCell: true,
                  pointCell: {
                    columns: {
                      id: true,
                    },
                    extras: {
                      x: sql<number>`ST_X(${pointCells.value})`.as("x"),
                      y: sql<number>`ST_Y(${pointCells.value})`.as("y"),
                    },
                  },
                  lineCell: {
                    columns: {
                      id: true,
                    },
                    extras: {
                      coordinates:
                        sql<string>`ST_AsText(${lineCells.value})`.as(
                          "coordinates",
                        ),
                    },
                  },
                  polygonCell: {
                    columns: {
                      id: true,
                    },
                    extras: {
                      coordinates:
                        sql<string>`ST_AsText(${polygonCells.value})`.as(
                          "coordinates",
                        ),
                    },
                  },
                  numberCell: true,
                  dateCell: true,
                  richtextCell: true,
                  iconCell: true,
                },
              },
            },
          },
          teamspace: {
            columns: {
              name: true,
            },
          },
        },
      });

      if (!dataset) {
        return null;
      }

      // Transform the dataset to include GeoJSON geometry
      return {
        ...dataset,
        rows: dataset.rows.map((row) => ({
          ...row,
          cells: row.cells.map((cell) => {
            if (cell.lineCell?.coordinates) {
              const geometry = wellknown.parse(cell.lineCell.coordinates);

              return {
                ...cell,
                lineCell: {
                  ...cell.lineCell,
                  coordinates:
                    geometry && geometry.type === "LineString"
                      ? geometry.coordinates
                      : [],
                },
              };
            }
            if (cell.polygonCell?.coordinates) {
              const geometry = wellknown.parse(cell.polygonCell.coordinates);

              return {
                ...cell,
                polygonCell: {
                  ...cell.polygonCell,
                  coordinates:
                    geometry && geometry.type === "Polygon"
                      ? geometry.coordinates
                      : [],
                },
              };
            }
            return cell;
          }),
        })),
      };
    });

export type GetDataset = UnwrapReturn<typeof getDataset>;
