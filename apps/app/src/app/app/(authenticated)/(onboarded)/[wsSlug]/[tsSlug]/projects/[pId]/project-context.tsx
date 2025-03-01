"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import type { GetLayerPoint } from "@mapform/backend/data/datalayer/get-layer-point";
import type { GetLayerMarker } from "@mapform/backend/data/datalayer/get-layer-marker";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { useMapform } from "~/components/mapform";
import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";
import { toast } from "@mapform/ui/components/toaster";
import {
  type InferUseActionHookReturn,
  useOptimisticAction,
} from "next-safe-action/hooks";
import { useAction } from "next-safe-action/hooks";
import type { GetPageData } from "@mapform/backend/data/datalayer/get-page-data";
import type { ListTeamspaceDatasets } from "@mapform/backend/data/datasets/list-teamspace-datasets";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import { uploadImageAction } from "~/data/images";
import { updatePageAction } from "~/data/pages/update-page";
import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";

type LayerPoint = NonNullable<GetLayerPoint["data"]>;
type LayerMarker = NonNullable<GetLayerMarker["data"]>;
type PageWithLayers = NonNullable<GetPageWithLayers["data"]>;
type PageData = NonNullable<GetPageData["data"]>;
type TeamspaceDatasets = NonNullable<ListTeamspaceDatasets["data"]>;
type ProjectWithPages = NonNullable<GetProjectWithPages["data"]>;

export interface ProjectContextProps {
  selectedFeature?: LayerPoint | LayerMarker;
  currentProject: ProjectWithPages;
  isEditingPage: boolean;
  currentPage: PageWithLayers | undefined;
  currentPageData: PageData | undefined;
  availableDatasets: TeamspaceDatasets;
  projectWithPages: ProjectWithPages;

  uploadImageServer: InferUseActionHookReturn<typeof uploadImageAction>;
  upsertCellServer: InferUseActionHookReturn<typeof upsertCellAction>;
  updatePageServer: InferUseActionHookReturn<typeof updatePageAction>;

  setActivePage: (
    page?: Pick<PageWithLayers, "id" | "center" | "zoom" | "pitch" | "bearing">,
  ) => void;

  updateProjectOptimistic: (
    action: NonNullable<GetProjectWithPages["data"]>,
  ) => void;
  updatePageOptimistic: (action: PageWithLayers) => void;
  updatePageDataOptimistic: (action: PageData) => void;
  updateSelectedFeatureOptimistic: (action: LayerPoint | LayerMarker) => void;

  updatePageServerTest: {
    execute: (args: Parameters<(input: any) => void>[0]) => void;
    optimisticState: unknown;
    isPending: boolean;
  };
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
  selectedFeature?: LayerPoint | LayerMarker;
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
      LayerPoint | LayerMarker | undefined,
      LayerPoint | LayerMarker
    >(selectedFeature, (state, newFeature) => ({
      ...state,
      ...newFeature,
    }));

  const updatePageServerTest = useDebouncedOptimisticAction(updatePageAction, {
    currentState: optimisticPage,
    updateFn: (state: any, newPage) => ({
      ...state,
      ...newPage,
    }),
    onError: ({ error }) => {
      if (error.serverError) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
        return;
      }

      if (error.validationErrors) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "We we unable to update your content. Please try again.",
        });
      }
    },
  });

  /**
   * Actions
   */
  const updatePageServer = useAction(updatePageAction, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
        return;
      }

      if (error.validationErrors) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "We we unable to update your content. Please try again.",
        });
      }
    },
  });

  const upsertCellServer = useAction(upsertCellAction, {
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "We we unable to update your content. Please try again.",
      });
    },
  });

  const uploadImageServer = useAction(uploadImageAction, {
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

  // Prevent page unload
  usePreventPageUnload(updatePageServer.isExecuting);
  usePreventPageUnload(upsertCellServer.isExecuting);
  usePreventPageUnload(uploadImageServer.isExecuting);

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

  return (
    <ProjectContext.Provider
      value={{
        isEditingPage,
        setActivePage,
        projectWithPages,
        availableDatasets,

        // Optimistic state
        currentPage: optimisticPage,
        currentProject: optimisticProject,
        currentPageData: optimisticPageData,
        selectedFeature: optimisticSelectedFeature,

        // For optimistic state updates
        updatePageOptimistic: (...args) => {
          startTransition(() => {
            updatePageOptimistic(...args);
          });
        },
        updateProjectOptimistic: (...args) => {
          startTransition(() => {
            updateProjectOptimistic(...args);
          });
        },
        updatePageDataOptimistic: (...args) => {
          startTransition(() => {
            updatePageDataOptimistic(...args);
          });
        },
        updateSelectedFeatureOptimistic: (...args) => {
          startTransition(() => {
            updateSelectedFeatureOptimistic(...args);
          });
        },

        // Actions
        updatePageServer,
        upsertCellServer,
        uploadImageServer,

        // Test
        updatePageServerTest,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

// This function takes in useAction arguments as the first and second arguments, and returns { execute, isPending, optimisticState }
function useDebouncedOptimisticAction(
  ...args: Parameters<typeof useOptimisticAction>
) {
  const {
    execute,
    optimisticState: actionOptimisticState,
    isPending: isExecutePending,
  } = useOptimisticAction(...args);
  const [_, startTransition] = useTransition();
  const [isPendingDebounced, setIsPendingDebounced] = useState(false);
  const [optimisticState, setOptimisticState] = useState(actionOptimisticState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedExecute = useCallback(
    (args: Parameters<typeof execute>[0]) => {
      setIsPendingDebounced(true);
      startTransition(() => {
        setOptimisticState({
          ...optimisticState,
          ...args,
        });
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        execute(args);
        setIsPendingDebounced(false);
      }, 2000);
    },
    [actionOptimisticState, execute],
  );

  const isPending = useMemo(() => {
    return isPendingDebounced || isExecutePending;
  }, [isPendingDebounced, isExecutePending]);

  usePreventPageUnload(isPending);

  return { execute: debouncedExecute, optimisticState, isPending };
}
