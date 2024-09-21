"use client";

import { useDebounce } from "@mapform/lib/hooks/use-debounce";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type StepWithLocation } from "@mapform/db/extentsions/steps";
import { useMapForm, type MBMap } from "@mapform/mapform";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import type { GetStepData } from "~/data/steps/get-step-data";
import { updateStep } from "~/data/steps/update";
import type { ProjectWithPages } from "~/data/projects/get-project-with-pages";

type Page = ProjectWithPages["pages"][number];

export interface ProjectContextProps {
  map: MBMap | undefined;
  dragPages: string[];
  projectWithPages: ProjectWithPages;
  currentPage: Page | undefined;
  currentPageIndex: number;
  currentEditablePage: Page | undefined;
  setDragPages: Dispatch<SetStateAction<string[]>>;
  // debouncedUpdateStep: typeof updateStep;
  setQueryParamFor: (param: "e" | "p", page?: Page) => void;
  points: GetStepData;
}

export const ProjectContext = createContext<ProjectContextProps>(
  {} as ProjectContextProps
);
export const useProjectContext = () => useContext(ProjectContext);

export function ProjectProvider({
  projectWithPages,
  points,
  children,
}: {
  projectWithPages: ProjectWithPages;
  points: GetStepData;
  children: React.ReactNode;
}) {
  const { map } = useMapForm();
  const router = useRouter();
  const pathname = usePathname();
  // const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  // Selected page view
  const p = searchParams.get("p");
  // Selected editable page
  const e = searchParams.get("e");

  const currentPageIndex = projectWithPages.pages.findIndex(
    (page) => page.id === p
  );

  const currentEditablePage = projectWithPages.pages.find(
    (page) => page.id === e
  );

  // const { mutateAsync: updateStepMutation } = useMutation({
  //   mutationFn: updateStep,
  //   onMutate: async ({ pageId, data }) => {
  //     const queryKey = ["forms", data.formId];
  //     await queryClient.cancelQueries({ queryKey });

  //     const prevProject: ProjectWithPages | undefined =
  //       queryClient.getQueryData(queryKey);

  //     // This should never happen
  //     if (!prevProject) return;

  //     const newForm = {
  //       ...prevProject,
  //       pages: prevProject.pages.map((page) =>
  //         page.id === pageId ? { ...step, ...data } : step
  //       ),
  //     };

  //     queryClient.setQueryData(queryKey, () => newForm);

  //     return { prevProject, newForm };
  //   },
  // });

  // const { data } = useQuery({
  //   placeholderData: (prevData) =>
  //     dataTrackForActiveStep && prevData ? prevData : { data: { points: [] } },
  //   queryKey: ["pointData", dataTrackForActiveStep?.id, bounds],
  //   queryFn: () =>
  //     getLayerData({
  //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //       dataTrackId: dataTrackForActiveStep!.id,
  //       bounds: {
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //         minLng: bounds!._sw.lng,
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //         minLat: bounds!._sw.lat,
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //         maxLng: bounds!._ne.lng,
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //         maxLat: bounds!._ne.lat,
  //       },
  //     }),
  //   enabled: Boolean(bounds) && Boolean(dataTrackForActiveStep),
  //   staleTime: Infinity,
  // });

  // const points = data?.data?.points.filter(notEmpty) || [];

  // TODO: Debounced update is not working
  // const debouncedUpdateStep = useDebounce(updateStepMutation, 500);
  // const debouncedUpdateStep = updateStepMutation;

  useEffect(() => {
    if (projectWithPages.pages[0] && !p) {
      router.push(
        `${pathname}?${createQueryString("p", projectWithPages.pages[0].id)}`
      );
    }
  }, [p, projectWithPages.pages, pathname, router, createQueryString]);

  // We hold the steps in its own React state due to this issue: https://github.com/clauderic/dnd-kit/issues/921
  const [dragPages, setDragPages] = useState<string[]>(
    projectWithPages.pages.map((page) => page.id)
  );

  const currentPage = projectWithPages.pages.find((page) => page.id === p);

  const setQueryParamFor = (
    param: "e" | "p",
    page?: ProjectWithPages["pages"][number]
  ) => {
    // Get current search params
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Clear the param if value is not provided
    if (!page) {
      current.delete(param);
    } else {
      if (param === "e") {
        current.set("p", page.id);
        current.set("e", page.id);
      }

      if (param === "p") {
        current.set("p", page.id);
        current.delete("e");

        map?.flyTo({
          center: [page.center.y, page.center.x],
          zoom: page.zoom,
          pitch: page.pitch,
          bearing: page.bearing,
          duration: 1000,
        });
      }
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <ProjectContext.Provider
      value={{
        map,
        currentPage,
        currentPageIndex,
        dragPages,
        setDragPages,
        projectWithPages,
        // debouncedUpdateStep,
        currentEditablePage,
        setQueryParamFor,
        points,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
