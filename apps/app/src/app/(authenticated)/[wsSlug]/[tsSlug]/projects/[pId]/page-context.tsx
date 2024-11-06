"use client";

import {
  createContext,
  useContext,
  // eslint-disable-next-line import/named -- It will work when React 19 is released
  useOptimistic,
} from "react";
import { useMapform } from "@mapform/mapform";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { PageData } from "@mapform/backend/datalayer/get-page-data";
import type { ListTeamspaceDatasets } from "@mapform/backend/datasets/list-teamspace-datasets";
import type { PageWithLayers } from "@mapform/backend/pages/get-page-with-layers";

export interface PageContextProps {
  isEditingPage: boolean;
  optimisticPage: PageWithLayers | undefined;
  optimisticPageData: PageData | undefined;
  availableDatasets: ListTeamspaceDatasets;
  updatePage: (action: PageWithLayers) => void;
  updatePageData: (action: PageData) => void;
  setActivePage: (
    page?: Pick<PageWithLayers, "id" | "center" | "zoom" | "pitch" | "bearing">,
  ) => void;
  setEditMode: (open: boolean) => void;
}

export const PageContext = createContext<PageContextProps>(
  {} as PageContextProps,
);
export const usePage = () => useContext(PageContext);

export function PageProvider({
  pageData,
  pageWithLayers,
  availableDatasets,
  children,
}: {
  pageData?: PageData;
  pageWithLayers?: PageWithLayers;
  availableDatasets: ListTeamspaceDatasets;
  children: React.ReactNode;
}) {
  const { map } = useMapform();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [optimisticPage, updatePage] = useOptimistic<
    PageWithLayers | undefined,
    PageWithLayers
  >(pageWithLayers, (state, newPage) => ({
    ...state,
    ...newPage,
  }));
  const [optimisticPageData, updatePageData] = useOptimistic<
    PageData | undefined,
    PageData
  >(pageData, (state, newPageData) => ({
    ...state,
    ...newPageData,
  }));

  const isEditingPage = Boolean(searchParams.get("edit"));

  const setActivePage = (page?: {
    id: string;
    center: { x: number; y: number };
    zoom: number;
    pitch: number;
    bearing: number;
  }) => {
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

  const setEditMode = (open: boolean) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!open) {
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
        updatePage,
        setEditMode,
        isEditingPage,
        setActivePage,
        optimisticPage,
        updatePageData,
        availableDatasets,
        optimisticPageData,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}
