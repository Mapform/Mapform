import {
  createLoader,
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
  geoapifyPlaceId: parseAsString,
  chatId: parseAsString,
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
    geoapifyPlaceId: "g",
    chatId: "c",
  },
};

export const loadSearchParams = createLoader(appSearchParams, appSearchOptions);

export type { SearchParams };
