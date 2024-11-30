"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import type { GetLayerPoint } from "@mapform/backend/datalayer/get-layer-point";
import type { GetLayerMarker } from "@mapform/backend/datalayer/get-layer-marker";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import type { ProjectWithPages } from "@mapform/backend/projects/get-project-with-pages";
import { useMapform } from "@mapform/mapform";
import type { PageWithLayers } from "@mapform/backend/pages/get-page-with-layers";
import type { UpdatePageSchema } from "@mapform/backend/pages/update-page/schema";
import type { DebouncedFunc } from "@mapform/lib/lodash";
import { debounce } from "@mapform/lib/lodash";
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
  optimisticProjectWithPages: ProjectWithPages;
  isEditingPage: boolean;
  currentPage: PageWithLayers | undefined;
  currentPageData: PageData | undefined;
  availableDatasets: ListTeamspaceDatasets;
  updatePage: InferUseActionHookReturn<typeof updatePageAction>["execute"];
  setOptimisticPageState: Dispatch<SetStateAction<PageWithLayers | undefined>>;
  uploadImage: DebouncedFunc<
    InferUseActionHookReturn<typeof uploadImageAction>["executeAsync"]
  >;
  upsertCell: DebouncedFunc<
    InferUseActionHookReturn<typeof upsertCellAction>["execute"]
  >;
  setActivePage: (
    page?: Pick<PageWithLayers, "id" | "center" | "zoom" | "pitch" | "bearing">,
  ) => void;
  setEditMode: (open: boolean) => void;
  updateProjectWithPages: (action: ProjectWithPages) => void;
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

  // Need extra state due to debounce with optimistic state issue: https://www.reddit.com/r/nextjs/comments/1h2xt8w/how_to_use_debounced_server_actions_with/
  // Optimistic state works as follows:
  // 1. While in debounce delay interval, set optimisticPageState and isPendingDebounce to true
  // 2. After debounce delay interval, execute server action. The server action isPending state will be true
  // 3. When the server action resolves, isPendingDebounce is set to false
  const [optimisticPageState, setOptimisticPageState] = useState<
    PageWithLayers | undefined
  >(pageWithLayers);
  const [isPendingDebounce, setIsPendingDebounce] = useState(false);

  const [optimisticProjectWithPages, updateProjectWithPages] = useOptimistic<
    ProjectWithPages,
    ProjectWithPages
  >(projectWithPages, (state, newProjectWithPages) => ({
    ...state,
    ...newProjectWithPages,
  }));

  /**
   * Actions
   */
  const { execute: executeUpdatePage, isPending } = useAction(
    updatePageAction,
    {
      onError: (response) => {
        if (response.error.validationErrors || response.error.serverError) {
          toast({
            title: "Uh oh! Something went wrong.",
            description: "An error occurred while updating the page.",
          });
        }

        // On error we reset the prev page state
        setOptimisticPageState(pageWithLayers);
      },
      onSettled: () => {
        setIsPendingDebounce(false);
      },
    },
  );
  const { executeAsync: executeAsyncUploadImage } = useAction(
    uploadImageAction,
    {
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
    },
  );
  const { execute: executeUpsertCell } = useAction(upsertCellAction, {
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "We we unable to update your content. Please try again.",
      });
    },
  });

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

  const upsertCell = useCallback(debounce(executeUpsertCell, 2000), []);
  const uploadImage = useCallback(debounce(executeAsyncUploadImage, 2000), []);
  const updatePageServer = useCallback(
    debounce(
      (
        pageId: string,
        {
          content,
          title,
          icon,
          zoom,
          pitch,
          bearing,
          center,
        }: Partial<PageWithLayers>,
      ) => {
        const payload = {
          id: pageId,
          ...(content !== undefined && { content }),
          ...(title !== undefined && { title }),
          ...(icon !== undefined && { icon }),
          ...(zoom !== undefined && { zoom }),
          ...(pitch !== undefined && { pitch }),
          ...(bearing !== undefined && { bearing }),
          ...(center !== undefined && { center }),
        };

        executeUpdatePage(payload);
      },
      2000,
      {
        trailing: true,
      },
    ),
    [],
  );

  const updatePage = (data: UpdatePageSchema) => {
    if (!pageWithLayers) {
      return;
    }

    setIsPendingDebounce(true);

    setOptimisticPageState({
      ...pageWithLayers,
      ...optimisticPageState,
      ...data,
    });
    // Must pass the optimistic state here, otherwise some staged changes may be
    // lost.
    updatePageServer(pageWithLayers.id, {
      ...optimisticPageState,
      ...data,
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

  return (
    <ProjectContext.Provider
      value={{
        selectedFeature,
        updateProjectWithPages,
        optimisticProjectWithPages,
        upsertCell,
        uploadImage,
        setEditMode,
        isEditingPage,
        setActivePage,
        currentPage:
          // We need two pending states here to handle period during debounce
          // and while action state is pending.
          isPendingDebounce || isPending ? optimisticPageState : pageWithLayers,
        updatePage,
        setOptimisticPageState,
        availableDatasets,
        currentPageData: pageData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
