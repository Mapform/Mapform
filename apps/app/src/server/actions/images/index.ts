"use server";

import { z } from "zod";
import { put } from "@vercel/blob";
import { uploadImageSchema } from "./schema";

export const uploadImage = async (formData: FormData) => {
  let data: { image: File } | null = null;

  try {
    data = uploadImageSchema.parse({
      image: formData.get("image"),
    }) as { image: File };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        error: e.issues[0]?.message,
      };
    }

    return {
      error: "There was an error uploading the image.",
    };
  }

  const image = data.image;

  try {
    const response = await put(image.name, image, {
      access: "public",
    });

    return {
      success: response,
    };
  } catch (e) {
    return {
      error: "There was an error uploading the image.",
    };
  }
};
