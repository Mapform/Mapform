"server-only";

import type { UserAuthClient } from "../../lib/types";
import { uploadImageSchema } from "./schema";
import { put } from "@vercel/blob";

export const uploadImage = (authClient: UserAuthClient) =>
  authClient.schema(uploadImageSchema).action(({ parsedInput: { image } }) =>
    put(image.name, image, {
      access: "public",
      addRandomSuffix: true,
    }),
  );
