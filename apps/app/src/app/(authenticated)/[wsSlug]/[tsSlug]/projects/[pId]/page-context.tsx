"use client";

import {
  createContext,
  useContext,
  // eslint-disable-next-line import/named -- It will work when React 19 is released
  useOptimistic,
} from "react";
import { useMap } from "@mapform/mapform";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { PageWithData } from "~/data/pages/get-page-with-data";

export interface PageContextProps {
  optimisticPage: PageWithData | undefined;
  updatePage: (action: PageWithData) => void;
  setActivePage: (
    page?: Pick<PageWithData, "id" | "center" | "zoom" | "pitch" | "bearing">
  ) => void;
  toggleActiveMode: () => void;
}

export const PageContext = createContext<PageContextProps>(
  {} as PageContextProps
);
export const usePage = () => useContext(PageContext);

export function PageProvider({
  pageWithData,
  children,
}: {
  pageWithData?: PageWithData;
  children: React.ReactNode;
}) {
  const { map } = useMap();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [optimisticPage, updatePage] = useOptimistic<
    PageWithData | undefined,
    PageWithData
  >(pageWithData, (state, newPage) => ({
    ...state,
    ...newPage,
  }));

  const setActivePage = (
    page?: Pick<PageWithData, "id" | "center" | "zoom" | "pitch" | "bearing">
  ) => {
    // Get current search params
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Clear the param if value is not provided
    if (!page?.id) {
      current.delete("page");
    } else {
      current.set("page", page.id);

      map?.flyTo({
        center: [page.center.x, page.center.y],
        zoom: page.zoom,
        pitch: page.pitch,
        bearing: page.bearing,
        duration: 1000,
      });
    }

    // Remove editMode
    current.delete("edit");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  const toggleActiveMode = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (current.has("edit")) {
      current.delete("edit");
    } else {
      current.set("edit", "1");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <PageContext.Provider
      value={{
        optimisticPage,
        updatePage,
        setActivePage,
        toggleActiveMode,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}
