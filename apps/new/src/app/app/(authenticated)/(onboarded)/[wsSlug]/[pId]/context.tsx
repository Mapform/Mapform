"use client";

import type { GetProject } from "@mapform/backend/data/projects/get-project";
import type { GetRow } from "@mapform/backend/data/rows/get-row";
import { notFound } from "next/navigation";
import { createContext, useContext, useTransition } from "react";
import { projectSearchParams, projectSearchParamsOptions } from "./params";
import { useQueryStates } from "nuqs";
import type { SearchPlaces } from "@mapform/backend/data/geoapify/search";
import type { SearchRows } from "@mapform/backend/data/rows/search-rows";
import {
  type StateServiceProps,
  useStateService,
} from "~/lib/use-state-service";
import { updateRowAction } from "~/data/rows/update-row";
import type { UpdateRowSchema } from "@mapform/backend/data/rows/update-row/schema";

export interface ProjectContextProps {
  features: NonNullable<GetProject["data"]>["rows"];
  project: NonNullable<GetProject["data"]>;
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  isFeaturePending: boolean;
  setSelectedFeature: (featureId: string | null) => void;
  vectorSearchResults?: SearchRows["data"];
  geoapifySearchResults?: SearchPlaces["data"];
  featureService: StateServiceProps<
    GetRow["data"] | undefined,
    UpdateRowSchema
  >;
}

export const ProjectContext = createContext<ProjectContextProps>(
  {} as ProjectContextProps,
);
export const useProject = () => useContext(ProjectContext);

export function ProjectProvider({
  children,
  feature,
  project,
  activeView,
  vectorSearchResults,
  geoapifySearchResults,
}: {
  feature?: GetRow["data"];
  project: GetProject["data"];
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  vectorSearchResults?: SearchRows["data"];
  geoapifySearchResults?: SearchPlaces["data"];
  children: React.ReactNode;
}) {
  const [isFeaturePending, startTransition] = useTransition();

  const [_, setProjectSearchParams] = useQueryStates(
    projectSearchParams,
    projectSearchParamsOptions,
  );

  const setSelectedFeature = (featureId: string | null) => {
    // Ignore if the feature is the same as the current selected feature
    if (feature?.id === featureId) {
      return;
    }

    void setProjectSearchParams(
      {
        rowId: featureId,
      },
      {
        shallow: false,
        ...(featureId ? { startTransition } : {}),
      },
    );
  };

  const featureService = useStateService<GetRow["data"], UpdateRowSchema>(
    updateRowAction,
    {
      currentState: feature,
      updateFn: (state, newRow) => {
        if (!state) return state;
        return {
          ...state,
          ...newRow,
        };
      },
    },
  );

  if (!project) {
    notFound();
  }

  const features = project.rows.map((row) => {
    if (row.id === feature?.id) {
      return {
        ...row,
        ...featureService.optimisticState,
      };
    }
    return row;
  });

  return (
    <ProjectContext.Provider
      value={{
        project,
        features,
        activeView,
        isFeaturePending,
        setSelectedFeature,
        vectorSearchResults,
        geoapifySearchResults,
        featureService,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
