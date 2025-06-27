import type { UrlKeys } from "nuqs/server";
import { parseAsInteger, createLoader, parseAsString } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const projectSearchParams = {
  perPage: parseAsInteger.withDefault(50),
  page: parseAsInteger.withDefault(0),
  viewId: parseAsString,
  rowId: parseAsString,
  query: parseAsString.withDefault(""),
};

export const projectSearchParamsUrlKeys: UrlKeys<typeof projectSearchParams> = {
  viewId: "v",
  perPage: "pp",
  page: "p",
  rowId: "r",
  query: "q",
};

export const projectSearchParamsOptions = {
  urlKeys: projectSearchParamsUrlKeys,
  shallow: false,
};

export const loadSearchParams = createLoader(projectSearchParams, {
  urlKeys: projectSearchParamsUrlKeys,
});
