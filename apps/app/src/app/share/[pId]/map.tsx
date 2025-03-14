"use client";

import { useMapform } from "~/components/mapform";
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
  MapformContent,
  MapformDrawer,
  MapformDrawerButton,
  MapformMap,
} from "~/components/mapform";
import { Blocknote } from "~/components/mapform/block-note";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";
import {
  LocationSearch,
  LocationSearchButton,
} from "~/components/location-search";
import { Button } from "@mapform/ui/components/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

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
  const [drawerValues, setDrawerValues] = useState<string[]>([
    "page-content",
    ...(selectedFeature ? ["feature"] : []),
  ]);
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

  const onStepSubmit = (data: Record<string, string>) => {
    if (currentSession) {
      execute({
        pageId: currentPage.id,
        submissionId: currentSession,
        payload: data,
      });
    }

    if (nextPage) {
      setCurrentPageAndFly(nextPage);
    }
  };

  const controls = (
    <div className={"fixed bottom-0 z-50 w-full bg-white md:absolute"}>
      <div className="px-2">
        <div className="relative flex h-[50px] w-full items-center justify-between">
          {prevPage ? (
            <Button
              className="absolute left-0"
              onClick={() => {
                setCurrentPageAndFly(prevPage);
              }}
              type="button"
              variant="ghost"
            >
              <ArrowLeftIcon className="-ml-1 mr-1 size-4" />
              Back
            </Button>
          ) : null}
          <p className="mx-auto text-xs text-gray-500">
            Made with{" "}
            <a className="text-gray-500" href="https://alpha.mapform.co">
              Mapform
            </a>
          </p>
          {nextPage && currentPage.pageType === "page" ? (
            <Button className="absolute right-0" type="submit">
              {nextPage.pageType === "page_ending" ? "Submit" : "Next"}
              <ArrowRightIcon className="-mr-1 ml-1 size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form
        className="flex h-full w-full flex-col md:overflow-hidden"
        onSubmit={form.handleSubmit(onStepSubmit)}
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
                  setDrawerValues([...drawerValues, "location-search"]);
                  setIsSelectingPinBlockLocationFor(val);
                }, 500);
              },
            }}
          >
            <MapformDrawer value="page-content">
              <Blocknote
                description={currentPage.content as { content: CustomBlock[] }}
                icon={currentPage.icon}
                key={currentPage.id}
                title={currentPage.title}
              />
              {drawerValues.length > 1 ? null : (
                <div className="hidden sm:block">{controls}</div>
              )}
            </MapformDrawer>
            {drawerValues.length > 1 ? null : (
              <div className="hidden max-sm:block">{controls}</div>
            )}
            <MapformDrawer
              onClose={() => {
                setDrawerValues(drawerValues.filter((v) => v !== "feature"));
              }}
              value="feature"
            >
              <Blocknote
                isFeature
                description={
                  selectedFeature?.description?.richtextCell?.value ?? undefined
                }
                icon={selectedFeature?.icon?.iconCell?.value}
                key={`${currentPage.id}-${selectedFeature?.rowId}`}
                title={selectedFeature?.title?.stringCell?.value}
              />
            </MapformDrawer>
          </CustomBlockProvider>
          <MapformDrawer
            className="bottom-0 max-sm:fixed"
            value="location-search"
            onClose={() => {
              setDrawerValues(
                drawerValues.filter((v) => v !== "location-search"),
              );
            }}
          >
            <LocationSearch>
              <LocationSearchButton
                onClick={(selectedFeature) => {
                  form.setValue(
                    `${isSelectingPinBlockLocationFor}.y`,
                    selectedFeature?.properties?.lat,
                  );
                  form.setValue(
                    `${isSelectingPinBlockLocationFor}.x`,
                    selectedFeature?.properties?.lon,
                  );
                  setIsSelectingPinBlockLocationFor(null);
                  setDrawerValues(
                    drawerValues.filter((v) => v !== "location-search"),
                  );
                }}
              >
                Select Location
              </LocationSearchButton>
            </LocationSearch>
          </MapformDrawer>
        </MapformContent>
      </form>
    </Form>
  );
}
