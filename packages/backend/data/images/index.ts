import { put } from "@vercel/blob";
import { UploadImageSchema } from "./schema";

export const uploadImage = async ({ image }: UploadImageSchema) =>
  put(image.name, image, {
    access: "public",
    addRandomSuffix: true,
  });
