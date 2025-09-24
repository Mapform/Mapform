"use server";

import { authDataService } from "~/lib/safe-action";
import { createRowWithColumnsSchema } from "./schema";

/**
 * NOTE: This is probably relatively inefficient, but shouldn't be a huge deal
 * for now, esp. given most places don't have too many properties to be copied
 * over.
 */
export const createRowWithExtrasAction = authDataService.authClient
  .schema(createRowWithColumnsSchema)
  .action(async ({ parsedInput: { projectId, cells, image, ...rest } }) => {
    const result = await authDataService.$transaction(async (client) => {
      /**
       * Get the project with its columns
       */
      const project = await client.getProject({ projectId });

      if (!project?.data) {
        throw new Error("Project not found");
      }

      /**
       * Get the columns that don't exist in the project
       */
      const nonExistingColumns = cells.filter(
        (cell) =>
          !project.data?.columns.some((c) => c.name === cell.columnName),
      );

      /**
       * Create the columns that don't exist in the project
       */
      await Promise.all(
        nonExistingColumns.map(async (column) => {
          await client.createColumn({
            projectId,
            name: column.columnName,
            type: column.type,
          });
        }),
      );

      /**
       * Create the row
       */
      const row = await client.createRow({ projectId, ...rest });
      const rowId = row?.data?.id;

      if (!rowId) {
        throw new Error("Failed to create row");
      }

      /**
       * Create the cells for the row
       */
      await Promise.all(
        cells.map((cell) => {
          switch (cell.type) {
            case "string":
              return client.upsertCell({
                rowId,
                columnName: cell.columnName,
                type: "string",
                value: cell.value,
              });
            case "number":
              return client.upsertCell({
                rowId,
                columnName: cell.columnName,
                type: "number",
                value: cell.value,
              });
            case "bool":
              return client.upsertCell({
                rowId,
                columnName: cell.columnName,
                type: "bool",
                value: cell.value,
              });
            case "date":
              return client.upsertCell({
                rowId,
                columnName: cell.columnName,
                type: "date",
                value: cell.value,
              });
          }
        }),
      );
      let uploadImageResponse;

      if (image) {
        uploadImageResponse = await client.uploadImage({
          workspaceId: project.data.teamspace.workspace.id,
          image: image.file,
          title: image.title,
          author: image.author,
          license: image.license,
          rowId,
        });
      }

      return {
        row,
        uploadImageResponse,
      };
    });

    return result;
  });
