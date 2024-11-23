import { z } from "zod";
import { zfd } from "zod-form-data";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const uploadImageSchema = zfd.formData({
  image: zfd.file().superRefine((file, ctx) => {
    console.log("Image size: ", file.size);
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
  }),
});

export type UploadImageSchema = z.infer<typeof uploadImageSchema>;
