"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import type { Page } from "@mapform/db/schema";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";
import { cn } from "@mapform/lib/classnames";
import type { FormSchema } from "@mapform/lib/schemas/form-step-schema";
import { CustomBlockContext } from "@mapform/blocknote";
import {
  type CustomBlock,
  getFormSchemaFromBlockNote,
} from "@mapform/blocknote";
import { useMeasure } from "@mapform/lib/hooks/use-measure";
import type { PageData, ViewState } from "@mapform/map-utils/types";
import { Button } from "@mapform/ui/components/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MapIcon,
  LetterTextIcon,
} from "lucide-react";
import { Blocknote } from "./block-note";
import {
  Map,
  MapProvider,
  useMap,
  type MBMap,
  SearchLocationMarker,
} from "./map";
import "./style.css";

interface MapFormProps {
  editable?: boolean;
  children?: React.ReactNode;
  mapboxAccessToken: string;
  currentPage: Page;
  defaultFormValues?: Record<string, string>;
  showBlocknote?: boolean;
  onPrev?: () => void;
  onLoad?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
  onStepSubmit?: (data: Record<string, string>) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
  pageData?: PageData;
  editFields?: {
    AddLocationDropdown: (input: { data: any }) => JSX.Element;
  };
}

export function MapForm({
  editable = false,
  onPrev,
  onLoad,
  pageData,
  children,
  editFields,
  currentPage,
  onStepSubmit,
  onTitleChange,
  onImageUpload,
  defaultFormValues,
  onDescriptionChange,
}: MapFormProps) {
  const [showMapMobile, setShowMapMobile] = useState(false);
  const blocknoteStepSchema = getFormSchemaFromBlockNote(
    currentPage.content?.content || [],
  );
  const form = useForm<z.infer<typeof blocknoteStepSchema>>({
    resolver: zodResolver(blocknoteStepSchema),
    defaultValues: defaultFormValues,
  });
  const [isSelectingPinLocationFor, setIsSelectingPinLocationFor] = useState<
    string | null
  >(null);
  const { ref: drawerRef } = useMeasure<HTMLDivElement>();
  const initialViewState = {
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
  };

  const onSubmit = (data: FormSchema) => {
    onStepSubmit?.(data);
  };

  const pinBlocks = currentPage.content?.content.filter((c) => {
    return c.type === "pin";
  });

  const AddLocationDropdown = editFields?.AddLocationDropdown;

  return (
    <Form {...form}>
      <form
        className="relative flex h-full w-full overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CustomBlockContext.Provider
          value={{
            editable,
            onImageUpload,
            isSelectingPinLocationFor,
            setIsSelectingPinLocationFor,
          }}
        >
          <div
            className={cn(
              "bg-background prose group absolute z-10 h-full overflow-hidden rounded-r-lg shadow-lg",
              editable && "pl-8",
            )}
            ref={drawerRef}
          >
            <div className="flex h-full w-[360px] flex-col">
              <Blocknote
                currentPage={currentPage}
                description={currentPage.content ?? undefined}
                editable={editable}
                isPage
                key={currentPage.id}
                onDescriptionChange={onDescriptionChange}
                onPrev={onPrev}
                onTitleChange={onTitleChange}
                title={currentPage.title}
              />
              <div
                className={cn("mt-auto flex justify-between px-4 py-2", {
                  hidden: editable,
                })}
              >
                <div className="gap-2">
                  <Button
                    disabled={editable}
                    onClick={onPrev}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <ArrowLeftIcon />
                  </Button>
                </div>
                <div
                  className={
                    currentPage.contentViewType === "text"
                      ? "block"
                      : "md:hidden"
                  }
                >
                  <Button
                    onClick={() => {
                      setShowMapMobile((prev) => !prev);
                    }}
                    variant="secondary"
                  >
                    {showMapMobile ? (
                      <>
                        <LetterTextIcon className="mr-2 size-5" />
                        Show Text
                      </>
                    ) : (
                      <>
                        <MapIcon className="mr-2 size-5" />
                        Show Map
                      </>
                    )}
                  </Button>
                </div>
                <Button
                  disabled={editable}
                  size="icon"
                  type="submit"
                  variant="ghost"
                >
                  <ArrowRightIcon />
                </Button>
              </div>
            </div>
          </div>
          <Map
            editable={editable}
            initialViewState={initialViewState}
            onLoad={onLoad}
            pageData={pageData}
          >
            {children}
          </Map>
        </CustomBlockContext.Provider>
      </form>
    </Form>
  );
}

MapForm.displayName = "MapForm";

export { MapProvider, useMap, SearchLocationMarker };
export type { ViewState, MBMap };
export type { MapboxEvent } from "mapbox-gl";

/* {searchLocation ? (
  <div
    className={cn(
      "group absolute bg-background z-10 w-full overflow-hidden",
      currentPage.contentViewType === "text"
        ? "h-full z-10"
        : currentPage.contentViewType === "split"
          ? `h-full ${contentWidth}`
          : `h-initial ${contentWidth} rounded-lg shadow-lg md:m-2`
    )}
    ref={drawerRef}
  >
    <div
      className={cn(
        "h-full w-full flex flex-col prose max-md:max-w-full mx-auto relative",
        {
          "px-9": editable && currentPage.contentViewType === "text",
          "pl-9": editable && currentPage.contentViewType !== "text",
          "max-h-[300px]": currentPage.contentViewType === "map",
        }
      )}
    >
      <Blocknote
        currentPage={currentPage}
        description={searchLocation.description ?? undefined}
        // Need key to force re-render, otherwise Blocknote state doesn't
        // change when changing steps
        editable={editable}
        key={searchLocation.id}
        locationEditorProps={{
          onClose: () => {
            setSearchLocation(null);
          },
        }}
        onDescriptionChange={(val) => {
          setSearchLocation((prev) => ({
            id: prev?.id ?? "",
            description: val,
            name: prev?.name ?? "",
            latitude: prev?.latitude ?? 0,
            longitude: prev?.longitude ?? 0,
          }));
        }}
        onTitleChange={(val) => {
          setSearchLocation((prev) => ({
            ...prev,
            name: val,
            id: prev?.id ?? "",
            latitude: prev?.latitude ?? 0,
            longitude: prev?.longitude ?? 0,
          }));
        }}
        title={searchLocation.name}
      />
      {editable && AddLocationDropdown && currentPage.projectId ? (
        <div className="p-4 ml-auto">
          <AddLocationDropdown
            data={{
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  searchLocation.longitude,
                  searchLocation.latitude,
                ],
              },
              properties: {},
            }}
          />
        </div>
      ) : null}
    </div>
  </div>
) : null} */
