"use server";

import { put } from "@vercel/blob";
import { uploadImageSchema } from "./schema";

export const uploadImage = async (formData: FormData) => {
  const { data, error } = uploadImageSchema.safeParse({
    image: formData.get("image"),
  });

  console.log(1111, data, error);

  if (error) {
    throw new Error("Invalid image");
  }

  const image = data.image as File;

  return put(image.name, image, {
    access: "public",
  });
};
