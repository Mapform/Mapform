"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useOptimistic,
  useTransition,
} from "react";
import type { GetLayerFeature } from "@mapform/backend/data/datalayer/get-layer-feature";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { useMapform } from "~/components/mapform";
import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";
import { toast } from "@mapform/ui/components/toaster";
import {
  type InferUseActionHookReturn,
  useAction,
} from "next-safe-action/hooks";
import type { GetPageData } from "@mapform/backend/data/datalayer/get-page-data";
import type { ListTeamspaceDatasets } from "@mapform/backend/data/datasets/list-teamspace-datasets";
import { uploadImageAction } from "~/data/images";
import { updatePageAction } from "~/data/pages/update-page";
import { useDebouncedOptimisticAction } from "~/lib/use-debounced-optimistic-action";
import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";

type LayerFeature = NonNullable<GetLayerFeature["data"]>;
type PageWithLayers = NonNullable<GetPageWithLayers["data"]>;
type PageData = NonNullable<GetPageData["data"]>;
type TeamspaceDatasets = NonNullable<ListTeamspaceDatasets["data"]>;
type ProjectWithPages = NonNullable<GetProjectWithPages["data"]>;

export interface ProjectContextProps {
  currentProject: ProjectWithPages;
  isEditingPage: boolean;
  availableDatasets: TeamspaceDatasets;
  projectWithPages: ProjectWithPages;
  selectedFeature?: LayerFeature;
  setSelectedFeature: (
    feature:
      | {
          rowId: LayerFeature["rowId"];
          layerId: LayerFeature["layerId"];
        }
      | undefined,
  ) => void;
  setActivePage: (
    page?: Pick<PageWithLayers, "id" | "center" | "zoom" | "pitch" | "bearing">,
  ) => void;

  updateProjectOptimistic: (
    action: NonNullable<GetProjectWithPages["data"]>,
  ) => void;

  updatePageServerAction: {
    execute: (args: Parameters<typeof updatePageAction>[0]) => void;
    optimisticState: PageWithLayers | undefined;
    isPending: boolean;
    setOptimisticState: (state: PageWithLayers) => void;
  };

  updatePageDataServerAction: {
    execute: (args: Parameters<typeof upsertCellAction>[0]) => void;
    optimisticState: PageData | undefined;
    isPending: boolean;
    setOptimisticState: (state: PageData) => void;
  };

  uploadImageServerAction: InferUseActionHookReturn<typeof uploadImageAction>;
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
  selectedFeature?: LayerFeature;
  pageData?: GetPageData["data"];
  pageWithLayers?: PageWithLayers;
  availableDatasets: TeamspaceDatasets;
  children: React.ReactNode;
}) {
  const { map } = useMapform();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  const [_, startTransition] = useTransition();
  const page = searchParams.get("page");
  const setQueryString = useSetQueryString();

  const [optimisticProject, updateProjectOptimistic] = useOptimistic<
    ProjectWithPages,
    ProjectWithPages
  >(projectWithPages, (state, newProject) => ({
    ...state,
    ...newProject,
  }));

  /**
   * Actions
   */
  const updatePageServerAction = useDebouncedOptimisticAction<
    PageWithLayers,
    Parameters<typeof updatePageAction>[0]
  >(updatePageAction, {
    currentState: pageWithLayers,
    updateFn: (state, newPage) => ({
      ...(state as PageWithLayers),
      ...(newPage as PageWithLayers),
    }),
    onError: ({ error }) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          (error.serverError as string | undefined) ??
          "We we unable to update your content. Please try again.",
      });
    },
  });

  const updatePageDataServerAction = useDebouncedOptimisticAction<
    PageData,
    Parameters<typeof upsertCellAction>[0]
  >(upsertCellAction, {
    currentState: pageData,
    updateFn: (state, newPage) => {
      if (newPage.type === "point") {
        return {
          ...(state as PageData),
          pointData: (state as PageData).pointData.map((point) =>
            point.rowId === newPage.rowId && point.columnId === newPage.columnId
              ? {
                  ...point,
                  value: newPage.value,
                }
              : point,
          ),
          markerData: (state as PageData).markerData.map((marker) =>
            marker.rowId === newPage.rowId &&
            marker.columnId === newPage.columnId
              ? { ...marker, value: newPage.value }
              : marker,
          ),
        };
      }

      if (newPage.type === "line") {
        return {
          ...(state as PageData),
          lineData: (state as PageData).lineData.map((line) =>
            line.rowId === newPage.rowId && line.columnId === newPage.columnId
              ? {
                  ...line,
                  value: newPage.value,
                }
              : line,
          ),
        };
      }

      if (newPage.type === "polygon") {
        return {
          ...(state as PageData),
          polygonData: (state as PageData).polygonData.map((polygon) =>
            polygon.rowId === newPage.rowId &&
            polygon.columnId === newPage.columnId
              ? {
                  ...polygon,
                  value: newPage.value,
                }
              : polygon,
          ),
        };
      }
    },
    onError: ({ error }) => {
      console.log("updatePageDataServerAction error", error);

      toast({
        title: "Uh oh! Something went wrong.",
        description:
          (error.serverError as string | undefined) ??
          "We we unable to update your content. Please try again.",
      });
    },
  });

  const uploadImageServerAction = useAction(uploadImageAction, {
    onError: (response) => {
      if (
        response.error.validationErrors &&
        "image" in response.error.validationErrors
      ) {
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

  const [optimisticSelectedFeature, setOptimisticSelectedFeature] =
    useOptimistic<LayerFeature | undefined, Partial<LayerFeature> | undefined>(
      selectedFeature,
      (state, newFeature) => {
        if (!state && !newFeature) return undefined;
        return {
          ...state,
          ...newFeature,
        } as LayerFeature;
      },
    );

  const setSelectedFeature = (
    feature:
      | {
          rowId: LayerFeature["rowId"];
          layerId: LayerFeature["layerId"];
        }
      | undefined,
  ) => {
    setOptimisticSelectedFeature(feature);
    setQueryString({
      key: "feature",
      value: feature ? `${feature.rowId}_${feature.layerId}` : null,
    });
  };

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
    current.delete("feature");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  usePreventPageUnload(updatePageServerAction.isPending);

  return (
    <ProjectContext.Provider
      value={{
        isEditingPage,
        setActivePage,
        projectWithPages,
        availableDatasets,
        selectedFeature: optimisticSelectedFeature,
        setSelectedFeature,
        // Optimistic state
        currentProject: optimisticProject,
        // For optimistic state updates
        updateProjectOptimistic: (...args) => {
          startTransition(() => {
            updateProjectOptimistic(...args);
          });
        },

        // Actions
        updatePageServerAction,
        updatePageDataServerAction,
        uploadImageServerAction,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
