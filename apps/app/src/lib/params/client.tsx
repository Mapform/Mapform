"use client";

import type { inferParserType } from "nuqs";
import { createContext, useContext, useTransition } from "react";
import { useQueryStates } from "nuqs";

import { appSearchOptions, appSearchParams } from "./server";

/**
 * Gets query parameters in the order they appear in the URL
 * @param url - The URL to parse (defaults to current window.location.href)
 * @returns Array of objects with key, value, and original order
 */
export function getQueryParamsInOrder(
  url?: string,
): Array<{ key: string; value: string; order: number }> {
  const urlToParse =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const urlObj = new URL(urlToParse);

  const params: Array<{ key: string; value: string; order: number }> = [];
  let order = 0;

  // Get the raw search string and parse it manually to preserve order
  const searchString = urlObj.search;
  if (searchString) {
    // Remove the leading '?' and split by '&'
    const paramPairs = searchString.slice(1).split("&");

    for (const pair of paramPairs) {
      const [key, value] = pair.split("=");
      if (key) {
        // Decode the key and value
        const decodedKey = decodeURIComponent(key);
        const decodedValue = value ? decodeURIComponent(value) : "";

        params.push({
          key: decodedKey,
          value: decodedValue,
          order: order++,
        });
      }
    }
  }

  return params;
}

/**
 * Gets query parameters as a Map where the key is the parameter name and the value is the order
 * Only includes: search, geoapifyPlaceId, chatId, rowId
 * @param url - The URL to parse (defaults to current window.location.href)
 * @returns Map with parameter keys and their order values
 */
export function getQueryParamsMapInOrder(
  url?: string,
): Map<keyof AppSearchParams, number> {
  const params = getQueryParamsInOrder(url);
  const orderedMap = new Map<keyof AppSearchParams, number>();

  // Create reverse mapping from short keys to full keys
  const reverseUrlKeys = new Map<string, keyof AppSearchParams>();
  for (const [fullKey, shortKey] of Object.entries(appSearchOptions.urlKeys)) {
    reverseUrlKeys.set(shortKey, fullKey as keyof AppSearchParams);
  }

  // Define the allowed keys
  const allowedKeys = new Set(["search", "geoapifyPlaceId", "chatId", "rowId"]);

  let sequentialOrder = 0;
  for (const param of params) {
    // Map short key back to full key if it exists
    const fullKey = reverseUrlKeys.get(param.key) || param.key;

    // Only include if it's one of the allowed keys
    if (allowedKeys.has(fullKey)) {
      orderedMap.set(fullKey as keyof AppSearchParams, sequentialOrder++);
    }
  }

  return orderedMap;
}

type AppSearchParams = inferParserType<typeof appSearchParams>;

export interface DefaultContext {
  isPending: boolean;
  params: AppSearchParams;
  setQueryStates: ReturnType<typeof useQueryStates>[1];
  drawerDepth: Map<keyof AppSearchParams, number>;
}

export const ParamsContext = createContext<DefaultContext>(
  {} as DefaultContext,
);
export const useParamsContext = () => useContext(ParamsContext);

interface ParamsProviderProps {
  children: React.ReactNode;
}

export const ParamsProvider = ({ children }: ParamsProviderProps) => {
  const [isPending, startTransition] = useTransition();
  const [
    { viewId, perPage, page, rowId, query, search, geoapifyPlaceId, chatId },
    setQueryStates,
  ] = useQueryStates(appSearchParams, { ...appSearchOptions, startTransition });
  const drawerOrder = getQueryParamsMapInOrder();
  const drawerSize = drawerOrder.size;
  const drawerDepth = new Map<keyof AppSearchParams, number>();

  // Calculate inverse: drawerDepth = drawerSize - drawerOrder
  for (const [key, order] of drawerOrder.entries()) {
    drawerDepth.set(key, drawerSize - order - 1);
  }

  return (
    <ParamsContext.Provider
      value={{
        isPending,
        params: {
          viewId,
          perPage,
          page,
          rowId,
          query,
          search,
          geoapifyPlaceId,
          chatId,
        },
        setQueryStates,
        drawerDepth,
      }}
    >
      {children}
    </ParamsContext.Provider>
  );
};
