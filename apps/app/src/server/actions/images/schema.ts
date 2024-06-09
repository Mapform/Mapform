import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const uploadImageSchema = z.object({
  image: z
    .any()
    .refine((file) => {
      return file?.size <= MAX_FILE_SIZE;
    })
    .refine((file) => {
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),
});
