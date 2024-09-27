"use client";

import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import { toast } from "@mapform/ui/components/toaster";
import type { CustomBlock } from "@mapform/blocknote";
import { useAction } from "next-safe-action/hooks";
import { debounce } from "@mapform/lib/lodash";
import { Settings2Icon } from "lucide-react";
import { uploadImage } from "~/data/images";
import { updatePage as updatePageAction } from "~/data/pages/update-page";
import { env } from "~/env.mjs";
import { usePage } from "../page-context";
import {
  PageDrawerRoot,
  PageDrawerTrigger,
  PageDrawerContent,
} from "./page-drawer";
import { PagePicker } from "./page-picker";
import { PageBarButton } from "./page-bar-button";
import { AddLocationDropdown } from "./add-location-dropdown";

function Project() {
  const { optimisticPage, isEditingPage, setEditMode, optimisticPageData } =
    usePage();

  const { executeAsync } = useAction(updatePageAction);

  if (!optimisticPage) {
    return null;
  }

  const updatePageServer = ({
    content,
    title,
    zoom,
    pitch,
    bearing,
    center,
  }: {
    content?: { content: CustomBlock[] };
    title?: string;
    zoom?: number;
    pitch?: number;
    bearing?: number;
    center?: { x: number; y: number };
  }) => {
    // @ts-expect-error -- Content type is not compatible with the schema
    return executeAsync({
      id: optimisticPage.id,
      ...(content && { content }),
      ...(title && { title }),
      ...(zoom && { zoom }),
      ...(pitch && { pitch }),
      ...(bearing && { bearing }),
      ...(center && { center }),
    });
  };

  const debouncedUpdatePageServer = debounce(updatePageServer, 1000);

  return (
    <div className="p-4 flex-1 flex justify-center overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex justify-between mb-4 overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar">
            <PagePicker />
          </div>
          {/* Edit controls */}
          <div className="flex gap-1">
            <PageDrawerRoot
              key={optimisticPage.id}
              onOpenChange={(isOpen) => {
                setEditMode(isOpen);
              }}
              open={isEditingPage}
            >
              <PageDrawerTrigger asChild>
                <PageBarButton
                  Icon={Settings2Icon}
                  isActive={isEditingPage}
                  onClick={() => {
                    setEditMode(!isEditingPage);
                  }}
                >
                  Edit Page
                </PageBarButton>
              </PageDrawerTrigger>
              <PageDrawerContent />
            </PageDrawerRoot>
          </div>
        </div>

        <div className="flex-1 flex">
          <MapForm
            currentPage={optimisticPage}
            editFields={{
              AddLocationDropdown,
            }}
            editable
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            onDescriptionChange={(content: { content: CustomBlock[] }) => {
              void debouncedUpdatePageServer({ content });
            }}
            onImageUpload={async (file: File) => {
              const formData = new FormData();
              formData.append("image", file);

              const { success, error } = await uploadImage(formData);

              if (error) {
                toast(error);
                return null;
              }

              return success?.url || null;
            }}
            onLocationSave={async (location) => {
              await debouncedUpdatePageServer({
                center: { x: location.longitude, y: location.latitude },
                zoom: location.zoom,
                pitch: location.pitch,
                bearing: location.bearing,
              });

              return { success: true };
            }}
            onTitleChange={(title: string) => {
              void debouncedUpdatePageServer({
                title,
              });
            }}
            pageData={optimisticPageData}
          />
        </div>
      </div>
    </div>
  );
}

// This is to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(Project), { ssr: false });
