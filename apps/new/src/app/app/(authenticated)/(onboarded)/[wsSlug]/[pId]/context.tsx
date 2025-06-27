"use client";

import type { GetProject } from "@mapform/backend/data/projects/get-project";
import type { GetRow } from "@mapform/backend/data/rows/get-row";
import { notFound } from "next/navigation";
import { createContext, useContext, useTransition } from "react";
import { projectSearchParams, projectSearchParamsOptions } from "./params";
import { useQueryStates } from "nuqs";
import type { SearchPlaces } from "@mapform/backend/data/geoapify/search";
import type { SearchRows } from "@mapform/backend/data/rows/search-rows";

export interface ProjectContextProps {
  feature?: GetRow["data"];
  project: NonNullable<GetProject["data"]>;
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  isFeaturePending: boolean;
  setSelectedFeature: (featureId: string | null) => void;
  vectorSearchResults?: SearchRows["data"];
  geoapifySearchResults?: SearchPlaces["data"];
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

  if (!project) {
    notFound();
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        feature,
        activeView,
        isFeaturePending,
        setSelectedFeature,
        vectorSearchResults,
        geoapifySearchResults,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
