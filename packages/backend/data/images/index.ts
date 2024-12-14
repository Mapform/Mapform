"server-only";

import { AuthClient } from "../../lib/types";
import { uploadImageSchema } from "./schema";
import { put } from "@vercel/blob";

export const uploadImage = (authClient: AuthClient) =>
  authClient.schema(uploadImageSchema).action(({ parsedInput: { image } }) =>
    put(image.name, image, {
      access: "public",
      addRandomSuffix: true,
    }),
  );
