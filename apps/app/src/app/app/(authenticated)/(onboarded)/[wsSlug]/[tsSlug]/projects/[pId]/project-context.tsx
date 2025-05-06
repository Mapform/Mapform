"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useOptimistic,
  useTransition,
} from "react";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { useMapform } from "~/components/mapform";
import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";
import { toast } from "@mapform/ui/components/toaster";
import {
  type InferUseActionHookReturn,
  useAction,
} from "next-safe-action/hooks";
import type { GetFeatures } from "@mapform/backend/data/features/get-features";
import type { ListTeamspaceDatasets } from "@mapform/backend/data/datasets/list-teamspace-datasets";
import { uploadImageAction } from "~/data/images";
import { updatePageAction } from "~/data/pages/update-page";
import { useDebouncedOptimisticAction } from "~/lib/use-debounced-optimistic-action";
import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import type { GetFeature } from "@mapform/backend/data/features/get-feature";

type Feature = NonNullable<GetFeature["data"]>;
type PageWithLayers = NonNullable<GetPageWithLayers["data"]>;
type Features = NonNullable<GetFeatures["data"]>;
type TeamspaceDatasets = NonNullable<ListTeamspaceDatasets["data"]>;
type ProjectWithPages = NonNullable<GetProjectWithPages["data"]>;

export interface ProjectContextProps {
  currentProject: ProjectWithPages;
  isEditingPage: boolean;
  availableDatasets: TeamspaceDatasets;
  projectWithPages: ProjectWithPages;
  selectedFeature?: Feature;
  setSelectedFeature: (feature: Feature | undefined) => void;
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

  updateFeaturesServerAction: {
    execute: (args: Parameters<typeof upsertCellAction>[0]) => void;
    optimisticState: Features | undefined;
    isPending: boolean;
    setOptimisticState: (state: Features) => void;
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
  features,
  pageWithLayers,
  availableDatasets,
  children,
}: {
  projectWithPages: ProjectWithPages;
  selectedFeature?: Feature;
  features?: Features;
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

  const updateFeaturesServerAction = useDebouncedOptimisticAction<
    Features,
    Parameters<typeof upsertCellAction>[0]
  >(upsertCellAction, {
    currentState: features,
    updateFn: (
      state: Features,
      newPage: Parameters<typeof upsertCellAction>[0],
    ) => {
      return state;

      const updatedFeatures = state.features.map((feature) => {
        if (!feature) return null;
        if (
          feature.properties.rowId === newPage.rowId &&
          feature.properties.columnId === newPage.columnId
        ) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              value: newPage.value,
            },
          };
        }
        return feature;
      });

      return {
        type: "FeatureCollection",
        features: updatedFeatures,
      };
    },
    onError: ({ error }) => {
      console.log("updateFeaturesServerAction error", error);

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
    useOptimistic<Feature | undefined, Partial<Feature> | undefined>(
      selectedFeature,
      (state, newFeature) => {
        if (!newFeature) return undefined;
        return {
          ...state,
          ...newFeature,
        } as Feature;
      },
    );

  const setSelectedFeature = (feature: Feature | undefined) => {
    startTransition(() => {
      setOptimisticSelectedFeature(feature);
    });
    setQueryString({
      key: "feature",
      value: feature ? feature.properties.id : null,
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
        updateFeaturesServerAction,
        uploadImageServerAction,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
