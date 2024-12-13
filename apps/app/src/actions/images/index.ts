"use server";

import { uploadImage } from "@mapform/backend/images";
import { uploadImageSchema } from "@mapform/backend/images/schema";
import { authAction } from "~/lib/safe-action";

export const uploadImageAction = authAction
  .schema(uploadImageSchema)
  .action(async ({ parsedInput }) => uploadImage(parsedInput));
