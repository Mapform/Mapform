"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useOptimistic } from "react";
import type { GetLayerPoint } from "@mapform/backend/datalayer/get-layer-point";
import type { GetLayerMarker } from "@mapform/backend/datalayer/get-layer-marker";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import type { ProjectWithPages } from "@mapform/backend/projects/get-project-with-pages";
import { useMapform } from "@mapform/mapform";
import type { PageWithLayers } from "@mapform/backend/pages/get-page-with-layers";
import { toast } from "@mapform/ui/components/toaster";
import type { InferUseActionHookReturn } from "next-safe-action/hooks";
import { useAction } from "next-safe-action/hooks";
import type { PageData } from "@mapform/backend/datalayer/get-page-data";
import type { ListTeamspaceDatasets } from "@mapform/backend/datasets/list-teamspace-datasets";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import { uploadImageAction } from "~/data/images";
import { updatePageAction } from "~/data/pages/update-page";

export interface ProjectContextProps {
  selectedFeature?: GetLayerPoint | GetLayerMarker;
  currentProject: ProjectWithPages;
  isEditingPage: boolean;
  currentPage: PageWithLayers | undefined;
  currentPageData: PageData | undefined;
  availableDatasets: ListTeamspaceDatasets;

  uploadImageServer: InferUseActionHookReturn<
    typeof uploadImageAction
  >["executeAsync"];
  upsertCellServer: InferUseActionHookReturn<
    typeof upsertCellAction
  >["execute"];
  updatePageServer: InferUseActionHookReturn<
    typeof updatePageAction
  >["execute"];

  setActivePage: (
    page?: Pick<PageWithLayers, "id" | "center" | "zoom" | "pitch" | "bearing">,
  ) => void;
  setEditMode: (open: boolean) => void;

  updateProjectOptimistic: (action: ProjectWithPages) => void;
  updatePageOptimistic: (action: PageWithLayers) => void;
  updatePageDataOptimistic: (action: PageData) => void;
  updateSelectedFeatureOptimistic: (
    action: GetLayerPoint | GetLayerMarker,
  ) => void;
}

export const ProjectContext = createContext<ProjectContextProps>(
  {} as ProjectContextProps,
);
export const useProject = () => useContext(ProjectContext);

/**
 * Used to update the project and global page info (like page order).
 * Page context handles editing the current page and related data.
 */
export function ProjectProvider({
  projectWithPages,
  selectedFeature,
  pageData,
  pageWithLayers,
  availableDatasets,
  children,
}: {
  projectWithPages: ProjectWithPages;
  selectedFeature?: GetLayerPoint | GetLayerMarker;
  pageData?: PageData;
  pageWithLayers?: PageWithLayers;
  availableDatasets: ListTeamspaceDatasets;
  children: React.ReactNode;
}) {
  const { map } = useMapform();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  const page = searchParams.get("page");

  const [optimisticPage, updatePageOptimistic] = useOptimistic<
    PageWithLayers | undefined,
    PageWithLayers
  >(pageWithLayers, (state, newPage) => ({
    ...state,
    ...newPage,
  }));

  const [optimisticProject, updateProjectOptimistic] = useOptimistic<
    ProjectWithPages,
    ProjectWithPages
  >(projectWithPages, (state, newProject) => ({
    ...state,
    ...newProject,
  }));

  const [optimisticPageData, updatePageDataOptimistic] = useOptimistic<
    PageData | undefined,
    PageData
  >(pageData, (state, newData) => ({
    ...state,
    ...newData,
  }));

  const [optimisticSelectedFeature, updateSelectedFeatureOptimistic] =
    useOptimistic<
      GetLayerPoint | GetLayerMarker | undefined,
      GetLayerPoint | GetLayerMarker
    >(selectedFeature, (state, newFeature) => ({
      ...state,
      ...newFeature,
    }));

  /**
   * Actions
   */
  const { execute: updatePageServer } = useAction(updatePageAction, {
    onError: (response) => {
      if (response.error.validationErrors || response.error.serverError) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "An error occurred while updating the page.",
        });
      }
    },
  });

  const { execute: upsertCellServer } = useAction(upsertCellAction, {
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "We we unable to update your content. Please try again.",
      });
    },
  });

  const { executeAsync: uploadImageServer } = useAction(uploadImageAction, {
    onError: (response) => {
      if (response.error.validationErrors) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: response.error.validationErrors.image?._errors?.[0],
        });

        return;
      }

      toast({
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while uploading the image.",
      });
    },
  });

  useEffect(() => {
    if (projectWithPages.pages[0] && !page) {
      router.push(
        `${pathname}?${createQueryString("p", projectWithPages.pages[0].id)}`,
      );
    }
  }, [page, projectWithPages.pages, pathname, router, createQueryString]);

  useEffect(() => {
    if (projectWithPages.pages[0] && !page) {
      router.push(
        `${pathname}?${createQueryString("page", projectWithPages.pages[0].id)}`,
      );
    }
  }, [page, projectWithPages.pages, pathname, router, createQueryString]);

  const isEditingPage = Boolean(searchParams.get("edit"));

  const setActivePage = (p?: {
    id: string;
    center: { x: number; y: number };
    zoom: number;
    pitch: number;
    bearing: number;
  }) => {
    // Get current search params
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Clear the param if value is not provided
    if (!p?.id) {
      current.delete("page");
    } else {
      current.set("page", p.id);

      map?.flyTo({
        center: [p.center.x, p.center.y],
        zoom: p.zoom,
        pitch: p.pitch,
        bearing: p.bearing,
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
    <ProjectContext.Provider
      value={{
        setEditMode,
        isEditingPage,
        setActivePage,
        availableDatasets,

        // Optimistic state
        currentPage: optimisticPage,
        currentProject: optimisticProject,
        currentPageData: optimisticPageData,
        selectedFeature: optimisticSelectedFeature,

        // For optimistic state updates
        updatePageOptimistic,
        updateProjectOptimistic,
        updatePageDataOptimistic,

        // Actions
        updatePageServer,
        upsertCellServer,
        uploadImageServer,
        updateSelectedFeatureOptimistic,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
