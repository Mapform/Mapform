import { z } from "zod";
import { zfd } from "zod-form-data";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const uploadImageSchema = zfd.formData({
  image: zfd.file(
    z
      .instanceof(File)
      .refine((file) => {
        return file?.size <= MAX_FILE_SIZE;
      })
      .refine((file) => {
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
  ),
});

export type UploadImageSchema = z.infer<typeof uploadImageSchema>;
