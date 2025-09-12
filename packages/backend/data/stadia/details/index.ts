"server-only";

import { detailsSchema } from "./schema";
import { env } from "../../../env.mjs";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { Configuration, GeocodingApi } from "@stadiamaps/api";

export const details = (authClient: PublicClient) =>
  authClient.schema(detailsSchema).action(async ({ parsedInput: { id } }) => {
    // No need to pass API key since using domain-based auth
    const config = new Configuration({ apiKey: env.STADIA_API_KEY });
    const api = new GeocodingApi(config);

    return api.placeDetailsV2({
      ids: [id],
      lang: "en",
    });
  });

export type Details = UnwrapReturn<typeof details>;
