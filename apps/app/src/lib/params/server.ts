import {
  createLoader,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  type SearchParams,
} from "nuqs/server";

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
    pitch: "p",
    bearing: "b",
  },
};

export const loadSearchParams = createLoader(appSearchParams, appSearchOptions);

export type { SearchParams };
