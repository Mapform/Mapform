import { z } from "zod";
import { insertBlobSchema } from "@mapform/db/schema";

export const MAX_FILE_SIZE = 2000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Custom file validation schema
export const fileSchema = z
  .custom<File>((val) => val instanceof File, {
    message: "Invalid file",
  })
  .superRefine((file, ctx) => {
    if (file.size > MAX_FILE_SIZE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File size must be less than 2MB.",
      });
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      });
    }
  });

// Schema for the parsed data
export const uploadImageSchema = z
  .object({
    workspaceId: insertBlobSchema.shape.workspaceId,
    projectId: insertBlobSchema.shape.projectId,
    rowId: insertBlobSchema.shape.rowId,
    author: insertBlobSchema.shape.author,
    license: insertBlobSchema.shape.license,
    licenseUrl: insertBlobSchema.shape.licenseUrl,
    sourceUrl: insertBlobSchema.shape.sourceUrl,
    image: fileSchema,
  })
  .refine(
    (data) => {
      if (data.projectId && data.rowId) {
        return false;
      }
      return true;
    },
    {
      message: "You can only upload an image to a project or a row, not both.",
    },
  );

export type UploadImageSchema = z.infer<typeof uploadImageSchema>;
