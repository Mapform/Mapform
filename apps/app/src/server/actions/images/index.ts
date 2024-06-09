"use server";

import { put } from "@vercel/blob";
import { authAction } from "~/lib/safe-action";
import { uploadImageSchema } from "./schema";

// export const uploadImage = authAction(uploadImageSchema, async ({ image }) => {
//   console.log(111111, image);

//   if (!image) {
//     throw new Error("No image provided.");
//   }

//   console.log(22222);

// return put(image.name, image, {
//   access: "public",
// });
// });

export const uploadImage = async (data: any) => {
  const image = data.get("image");

  return put(image.name, image, {
    access: "public",
  });
  // const { name, age, likesPizza } = schema.parse(await request.formData());
  // do something with parsed data
};
