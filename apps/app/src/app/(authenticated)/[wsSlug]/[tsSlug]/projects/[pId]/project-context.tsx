"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  // eslint-disable-next-line import/named -- It will work when React 19 is released
  useOptimistic,
} from "react";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import type { ProjectWithPages } from "~/data/projects/get-project-with-pages";

export interface ProjectContextProps {
  optimisticProjectWithPages: ProjectWithPages;
  updateProjectWithPages: (action: ProjectWithPages) => void;
}

export const ProjectContext = createContext<ProjectContextProps>(
  {} as ProjectContextProps
);
export const useProject = () => useContext(ProjectContext);

/**
 * Used to update the project and global page info (like page order).
 * Page context handles editing the current page and related data.
 */
export function ProjectProvider({
  projectWithPages,
  children,
}: {
  projectWithPages: ProjectWithPages;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  // Selected page view
  const page = searchParams.get("page");
  // Selected editable page
  // const e = searchParams.get("e");

  const [optimisticProjectWithPages, updateProjectWithPages] = useOptimistic<
    ProjectWithPages,
    ProjectWithPages
  >(projectWithPages, (state, newProjectWithPages) => ({
    ...state,
    ...newProjectWithPages,
  }));

  useEffect(() => {
    if (projectWithPages.pages[0] && !page) {
      router.push(
        `${pathname}?${createQueryString("p", projectWithPages.pages[0].id)}`
      );
    }
  }, [page, projectWithPages.pages, pathname, router, createQueryString]);

  useEffect(() => {
    if (projectWithPages.pages[0] && !page) {
      router.push(
        `${pathname}?${createQueryString("page", projectWithPages.pages[0].id)}`
      );
    }
  }, [page, projectWithPages.pages, pathname, router, createQueryString]);

  return (
    <ProjectContext.Provider
      value={{
        updateProjectWithPages,
        optimisticProjectWithPages,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
