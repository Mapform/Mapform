"use client";

import { MapForm, useMapform } from "~/components/mapform";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState } from "react";
import type { GetPageData } from "@mapform/backend/data/datalayer/get-page-data";
import type { GetLayerPoint } from "@mapform/backend/data/datalayer/get-layer-point";
import { type GetLayerMarker } from "@mapform/backend/data/datalayer/get-layer-marker";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { Responses } from "@mapform/backend/data/rows/get-responses";
import { createSubmissionAction } from "~/data/rows/create-submission";
import {
  CustomBlockProvider,
  getFormSchemaFromBlockNote,
  type CustomBlock,
} from "@mapform/blocknote";
import { submitPageAction } from "./actions";
import {
  Mapform,
  MapformContent,
  MapformDrawer,
  MapformDrawerButton,
  MapformMap,
} from "~/components/new-mapform";
import { Blocknote } from "~/components/mapform/block-note";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";

interface MapProps {
  pageData: GetPageData["data"];
  projectWithPages: NonNullable<GetProjectWithPages["data"]>;
  formValues: NonNullable<NonNullable<Responses>["data"]>["cells"];
  selectedFeature?: GetLayerPoint["data"] | GetLayerMarker["data"];
  sessionId: string | null;
  isUsingSessions: boolean;
}

type Page = NonNullable<GetProjectWithPages["data"]>["pages"][number];

export function Map({
  pageData,
  sessionId,
  formValues,
  isUsingSessions,
  projectWithPages,
  selectedFeature,
}: MapProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const p = searchParams.get("p");
  const currentPage = projectWithPages.pages.find((page) => page.id === p);
  const [drawerValues, setDrawerValues] = useState<string[]>(["page-content"]);
  const [isSelectingPinBlockLocationFor, setIsSelectingPinBlockLocationFor] =
    useState<string | null>(null);
  const blocknoteStepSchema = getFormSchemaFromBlockNote(
    currentPage?.content?.content || [],
  );

  const pageValues = (currentPage?.content?.content ?? []).reduce(
    (acc: Record<string, string>, block) => {
      const cellValue = formValues.find(
        (v) => v.column.blockNoteId === block.id,
      );
      const value = cellValue?.stringCell?.value ?? cellValue?.pointCell;

      if (value) {
        // @ts-expect-error -- It's ok
        acc[block.id] = value;
      }

      return acc;
    },
    {},
  );

  const form = useForm<z.infer<typeof blocknoteStepSchema>>({
    resolver: zodResolver(blocknoteStepSchema),
    defaultValues: pageValues,
  });

  const setCurrentPage = (page: Page) => {
    router.replace(`${pathname}?p=${page.id}`);
  };

  const { map } = useMapform();

  const [currentSession, setCurrentSession] = useState<string | null>(null);

  const { execute } = useAction(submitPageAction);

  const setCurrentPageAndFly = (page: Page) => {
    setCurrentPage(page);
    map?.flyTo({
      center: [page.center.x, page.center.y],
      zoom: page.zoom,
      pitch: page.pitch,
      bearing: page.bearing,
      duration: 1000,
    });
  };

  useEffect(() => {
    void (async () => {
      let newSessionId = sessionId;

      // If we don't have a submissionsDataset, we are not create sessions
      if (!isUsingSessions) {
        return;
      }

      if (!newSessionId) {
        const response = await createSubmissionAction({
          projectId: projectWithPages.id,
        });

        if (response) {
          newSessionId = response;
        }
      }
      setCurrentSession(newSessionId);
    })();
  }, [projectWithPages, sessionId, isUsingSessions]);

  /**
   * Fix the 'p' query param if no valid page
   */
  useEffect(() => {
    if (projectWithPages.pages[0] && (!p || !currentPage)) {
      const firstStep = projectWithPages.pages[0];

      router.replace(`${pathname}?p=${projectWithPages.pages[0].id}`);

      map?.flyTo({
        center: [firstStep.center.x, firstStep.center.y],
        zoom: firstStep.zoom,
        pitch: firstStep.pitch,
        bearing: firstStep.bearing,
        duration: 1000,
      });
    }
  }, [p, map, router, pathname, currentPage, projectWithPages.pages]);

  if ((isUsingSessions && !currentSession) || !currentPage) {
    return null;
  }

  const prevPageIndex =
    projectWithPages.pages.findIndex((page) => page.id === currentPage.id) - 1;
  const nextPageIndex =
    projectWithPages.pages.findIndex((page) => page.id === currentPage.id) + 1;
  const prevPage = projectWithPages.pages[prevPageIndex];
  const nextPage = projectWithPages.pages[nextPageIndex];

  return (
    <Mapform>
      <Form {...form}>
        <form
          className="flex h-full w-full flex-col md:overflow-hidden"
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <MapformContent
            drawerValues={drawerValues}
            onDrawerValuesChange={setDrawerValues}
            pageData={pageData}
          >
            <MapformDrawerButton
              onOpen={() => setDrawerValues([...drawerValues, "page-content"])}
            />
            <MapformMap
              initialViewState={{
                longitude: currentPage.center.x,
                latitude: currentPage.center.y,
                zoom: currentPage.zoom,
                bearing: currentPage.bearing,
                pitch: currentPage.pitch,
                padding: {
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                },
              }}
            />
            <CustomBlockProvider
              pinBlock={{
                isSelectingLocationFor: isSelectingPinBlockLocationFor,
                setIsSelectingLocationFor: (val) => {
                  // TODO: Improve this temporary workaround. If you don't
                  // scroll to the bottom first, there is a jarring animation
                  // when opening the next drawer
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => {
                    setIsSelectingPinBlockLocationFor(val);
                  }, 500);
                },
              }}
            >
              <MapformDrawer
                positionDesktop="absolute"
                positionMobile="relative"
                value="page-content"
              >
                <Blocknote
                  description={
                    currentPage.content as { content: CustomBlock[] }
                  }
                  isEditing
                  icon={currentPage.icon}
                  includeFormBlocks={
                    projectWithPages.formsEnabled &&
                    currentPage.pageType === "page"
                  }
                  key={currentPage.id}
                  title={currentPage.title}
                />
              </MapformDrawer>
            </CustomBlockProvider>
          </MapformContent>
        </form>
      </Form>
    </Mapform>
  );

  // return (
  //   <MapForm
  //     currentPage={currentPage}
  //     defaultFormValues={pageValues}
  //     mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
  //     nextPage={nextPage}
  //     onPrev={
  //       prevPage
  //         ? () => {
  //             setCurrentPageAndFly(prevPage);
  //           }
  //         : undefined
  //     }
  // onStepSubmit={
  // nextPage
  //   ? (data) => {
  //       if (currentSession) {
  //         execute({
  //           pageId: currentPage.id,
  //           submissionId: currentSession,
  //           payload: data,
  //         });
  //       }

  //       setCurrentPageAndFly(nextPage);
  //     }
  //   : undefined
  // }
  //     pageData={pageData}
  //     selectedFeature={selectedFeature}
  //   />
  // );
}
