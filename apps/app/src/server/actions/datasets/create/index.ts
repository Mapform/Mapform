"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createDatasetSchema } from "./schema";

export const createDataset = authAction(
  createDatasetSchema,
  async ({ name, workspaceId, data }) => {
    // Validate field types are consistent
    if (!validateFieldTypes(data)) {
      throw new Error("Field types are inconsistent");
    }

    if (data.length === 0) {
      throw new Error("Dataset is empty");
    }

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
              ...Object.entries(data[0]!).map(([key, value]) => ({
                name: key,
                // TODO: Map types to Prisma types
                dataType: "STRING" as const,
              })),
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
              ...data.map((row) => ({
                cellValues: {
                  create: Object.entries(row).map(([key, value]) => ({
                    stringCell: {
                      create: {
                        value: value as string,
                      },
                    },
                    column: {
                      connect: {
                        datasetId_name: {
                          datasetId: datasetWithCols.id,
                          name: key,
                        },
                      },
                    },
                  })),
                },
              })),
            ],
          },
        },
      });

      return dateset;
    });

    revalidatePath("/");
  }
);

function validateFieldTypes(array: Record<string, any>[]) {
  if (array.length === 0) {
    return true; // Empty array is considered valid
  }

  const fieldTypes: Record<string, any> = {};

  // Initialize field types based on the first object
  for (const key in array[0]) {
    fieldTypes[key] = typeof array[0][key];
  }

  // Compare the types of the rest of the objects
  for (let i = 1; i < array.length; i++) {
    for (const key in array[i]) {
      if (typeof array[i]![key] !== fieldTypes[key]) {
        return false;
      }
    }
  }

  return true;
}

function mapTypesToPrismaTypes(type: string) {
  switch (type) {
    case "string":
      return "String";
    case "number":
      return "Int";
    case "boolean":
      return "Boolean";
    default:
      return "String";
  }
}
