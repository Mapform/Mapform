"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createDatasetSchema } from "./schema";

export const createDataset = authAction(
  createDatasetSchema,
  async ({ name, workspaceId }) => {
    await prisma.$transaction(async (tx) => {
      const datasetWithCols = await tx.dataset.create({
        data: {
          name,
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
          columns: {
            create: [
              { name: "ID", dataType: "STRING" },
              { name: "Latitude", dataType: "FLOAT" },
              { name: "Longitude", dataType: "FLOAT" },
            ],
          },
        },
      });

      const dateset = await tx.dataset.update({
        where: {
          id: datasetWithCols.id,
        },
        data: {
          rows: {
            create: [
              {
                cellValues: {
                  create: [{ value: "" }],
                },
              },
            ],
          },
        },
      });

      return dateset;
    });

    revalidatePath("/");
  }
);
