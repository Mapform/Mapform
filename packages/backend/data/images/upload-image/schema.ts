import { z } from "zod";

export const MAX_FILE_SIZE = 2000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Custom file validation schema
const fileSchema = z
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
const parsedSchema = z.object({
  workspaceId: z.string(),
  image: fileSchema,
});

// Custom schema that can handle FormData input
export const uploadImageSchema = z
  .custom<FormData>((val) => val instanceof FormData, {
    message: "Input must be FormData",
  })
  .transform((formData) => {
    const workspaceId = formData.get("workspaceId");
    const image = formData.get("image");

    return parsedSchema.parse({ workspaceId, image });
  });

export type UploadImageSchema = z.infer<typeof parsedSchema>;
