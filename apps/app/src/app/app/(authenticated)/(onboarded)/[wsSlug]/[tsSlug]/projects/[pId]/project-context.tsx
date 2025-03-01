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
  useAction,
  useOptimisticAction,
} from "next-safe-action/hooks";
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

  setActivePage: (
    page?: Pick<PageWithLayers, "id" | "center" | "zoom" | "pitch" | "bearing">,
  ) => void;

  updateProjectOptimistic: (
    action: NonNullable<GetProjectWithPages["data"]>,
  ) => void;
  updatePageOptimistic: (action: PageWithLayers) => void;
  updatePageDataOptimistic: (action: PageData) => void;
  updateSelectedFeatureOptimistic: (action: LayerPoint | LayerMarker) => void;

  updatePageServerAction: {
    execute: (args: Parameters<typeof updatePageAction>[0]) => void;
    optimisticState: PageWithLayers | undefined;
    isPending: boolean;
  };
  upsertCellServerAction: {
    execute: (args: Parameters<typeof upsertCellAction>[0]) => void;
    optimisticState:
      | InferUseActionHookReturn<typeof upsertCellAction>
      | undefined;
    isPending: boolean;
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

  /**
   * Actions
   */
  const updatePageServerAction = useDebouncedOptimisticAction<
    PageWithLayers,
    Parameters<typeof updatePageAction>[0]
  >(updatePageAction, {
    currentState: optimisticPage,
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

  const upsertCellServerAction = useDebouncedOptimisticAction<
    InferUseActionHookReturn<typeof upsertCellAction>,
    Parameters<typeof upsertCellAction>[0]
  >(upsertCellAction, {
    currentState: optimisticPage,
    updateFn: (state, newCell) => ({
      ...(state as InferUseActionHookReturn<typeof upsertCellAction>),
      ...(newCell as InferUseActionHookReturn<typeof upsertCellAction>),
    }),
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "We we unable to update your content. Please try again.",
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
        updatePageServerAction,
        upsertCellServerAction,
        uploadImageServerAction,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

// This function takes in useAction arguments as the first and second arguments, and returns { execute, isPending, optimisticState }
function useDebouncedOptimisticAction<TState, TAction>(
  ...args: Parameters<typeof useOptimisticAction>
) {
  const {
    execute,
    optimisticState: actionOptimisticState,
    isPending: isExecutePending,
  } = useOptimisticAction(...args);
  const [_, startTransition] = useTransition();
  const [isPendingDebounced, setIsPendingDebounced] = useState(false);
  const [optimisticState, setOptimisticState] = useState<TState>(
    actionOptimisticState as TState,
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedExecute = useCallback(
    (args: TAction) => {
      const newState = {
        ...optimisticState,
        ...args,
      };

      setIsPendingDebounced(true);
      startTransition(() => {
        setOptimisticState(newState);
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        execute(newState);
        setIsPendingDebounced(false);
      }, 2000);
    },
    [execute, optimisticState],
  );

  const isPending = useMemo(() => {
    return isPendingDebounced || isExecutePending;
  }, [isPendingDebounced, isExecutePending]);

  usePreventPageUnload(isPending);

  return { execute: debouncedExecute, optimisticState, isPending };
}
