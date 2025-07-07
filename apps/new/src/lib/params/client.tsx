"use client";

import type { inferParserType } from "nuqs";
import { createContext, useContext, useTransition } from "react";
import { useQueryStates } from "nuqs";

import { appSearchOptions, appSearchParams } from "./server";

type AppSearchParams = inferParserType<typeof appSearchParams>;

export interface DefaultContext {
  isPending: boolean;
  params: AppSearchParams;
  setQueryStates: (obj: Partial<AppSearchParams>) => Promise<URLSearchParams>;
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
    { viewId, perPage, page, rowId, query, geoapifyPlaceId, chatId },
    setQueryStates,
  ] = useQueryStates(appSearchParams, { ...appSearchOptions, startTransition });

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
          geoapifyPlaceId,
          chatId,
        },
        setQueryStates,
      }}
    >
      {children}
    </ParamsContext.Provider>
  );
};
