import {
  createLoader,
  parseAsFloat,
  parseAsInteger,
  parseAsJson,
  parseAsString,
  type SearchParams,
} from "nuqs/server";
import z from "zod";

const chatOptionsSchema = z.object({
  mapCenter: z.boolean().optional(),
  userCenter: z.boolean().optional(),
  projects: z.array(z.string()).optional(),
});

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const appSearchParams = {
  perPage: parseAsInteger.withDefault(50),
  page: parseAsInteger.withDefault(0),
  viewId: parseAsString,
  rowId: parseAsString,
  query: parseAsString,
  search: parseAsString,
  stadiaId: parseAsString,
  chatId: parseAsString,
  marker: parseAsString,
  location: parseAsString,
  zoom: parseAsFloat,
  pitch: parseAsFloat,
  bearing: parseAsFloat,
  chatOptions: parseAsJson((value) => chatOptionsSchema.parse(value)),
};

export const appSearchOptions = {
  // Forces server update to refetch SSR pages
  shallow: false,
  urlKeys: {
    viewId: "v",
    perPage: "pp",
    page: "p",
    rowId: "r",
    query: "q",
    search: "s",
    stadiaId: "sid",
    chatId: "c",
    marker: "m",
    location: "loc",
    zoom: "z",
    pitch: "pi",
    bearing: "b",
    chatOptions: "co",
  },
};

export const loadSearchParams = createLoader(appSearchParams, appSearchOptions);

export type { SearchParams };
