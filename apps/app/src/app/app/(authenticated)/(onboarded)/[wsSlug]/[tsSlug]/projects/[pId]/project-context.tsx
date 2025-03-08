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
import type { InferSafeActionFnInput } from "next-safe-action";

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
  currentPageData: PageData | undefined;
  availableDatasets: TeamspaceDatasets;
  projectWithPages: ProjectWithPages;

  setActivePage: (
    page?: Pick<PageWithLayers, "id" | "center" | "zoom" | "pitch" | "bearing">,
  ) => void;

  updateProjectOptimistic: (
    action: NonNullable<GetProjectWithPages["data"]>,
  ) => void;
  updatePageDataOptimistic: (action: PageData) => void;

  updatePageServerAction: {
    execute: (args: Parameters<typeof updatePageAction>[0]) => void;
    optimisticState: PageWithLayers | undefined;
    isPending: boolean;
    setOptimisticState: (state: PageWithLayers) => void;
  };
  upsertCellServerAction: {
    execute: (
      args: InferSafeActionFnInput<typeof upsertCellAction>["clientInput"],
    ) => void;
    optimisticState: LayerPoint | LayerMarker | undefined;
    isPending: boolean;
    setOptimisticState: (state: LayerPoint | LayerMarker) => void;
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

  const upsertCellServerAction = useDebouncedOptimisticAction<
    LayerPoint | LayerMarker,
    InferSafeActionFnInput<typeof upsertCellAction>["clientInput"]
  >(upsertCellAction, {
    currentState: selectedFeature,
    updateFn: (
      state: unknown,
      payload: InferSafeActionFnInput<typeof upsertCellAction>["clientInput"],
    ) => {
      const typedState = state as LayerPoint | LayerMarker | undefined;
      if (!typedState) return state;

      switch (payload.type) {
        case "icon":
          if (typedState.icon) {
            return {
              ...typedState,
              icon: {
                ...typedState.icon,
                iconCell: {
                  ...typedState.icon.iconCell,
                  value: payload.value,
                },
              },
            };
          }
          break;
        case "string":
          if (typedState.title) {
            return {
              ...typedState,
              title: {
                ...typedState.title,
                stringCell: {
                  ...typedState.title.stringCell,
                  value: payload.value,
                },
              },
            };
          }
          break;
        case "richtext":
          if (typedState.description) {
            return {
              ...typedState,
              description: {
                ...typedState.description,
                richtextCell: {
                  ...typedState.description.richtextCell,
                  value: payload.value,
                },
              },
            };
          }
          break;
      }
      return state;
    },
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
        currentProject: optimisticProject,
        currentPageData: optimisticPageData,
        // For optimistic state updates
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
  const updateFn = args[1].updateFn;

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
      const newState = updateFn(optimisticState, args);

      setIsPendingDebounced(true);
      startTransition(() => {
        setOptimisticState(newState as TState);
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        execute(args);
        setIsPendingDebounced(false);
      }, 2000);
    },
    [execute, optimisticState, updateFn],
  );

  const isPending = useMemo(() => {
    return isPendingDebounced || isExecutePending;
  }, [isPendingDebounced, isExecutePending]);

  // Update optimistic state when new args are available and no longer pending.
  // This is so that if state is updated via an SSR change, the client state is
  // updated.
  useEffect(() => {
    if (!isPending) {
      setOptimisticState(actionOptimisticState as TState);
    }
  }, [actionOptimisticState, isPending]);

  usePreventPageUnload(isPending);

  return {
    execute: debouncedExecute,
    optimisticState,
    isPending,
    setOptimisticState,
  };
}
