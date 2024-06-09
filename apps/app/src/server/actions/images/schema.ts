import { z } from "zod";
import { zfd } from "zod-form-data";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const uploadImageSchema = zfd.formData({
  image: zfd.file(
    z
      .any()
      // .refine((file) => {
      //   console.log(2222, file);
      //   return file?.size <= MAX_FILE_SIZE;
      // })
      // .refine((file) => {
      //   console.log(3333, file);
      //   return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      // })
      .optional()
  ),
});
