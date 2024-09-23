"use client";

import { useTransition } from "react";
import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import { toast } from "@mapform/ui/components/toaster";
import type { CustomBlock } from "@mapform/blocknote";
import { useAction } from "next-safe-action/hooks";
import { debounce } from "@mapform/lib/lodash";
import { Settings2Icon } from "lucide-react";
import { uploadImage } from "~/data/images";
import { updateStepWithLocation } from "~/data/steps/update-location";
import { updatePage as updatePageAction } from "~/data/pages/update-page";
import { env } from "~/env.mjs";
import { usePage } from "../page-context";
import { useProject } from "../project-context";
import {
  PageDrawerRoot,
  PageDrawerTrigger,
  PageDrawerContent,
} from "./page-drawer";
import { PagePicker } from "./page-picker";
import { PageBarButton } from "./page-bar-button";
import { AddLocationDropdown } from "./add-location-dropdown";

function Project() {
  const [_, startTransition] = useTransition();
  const { optimisticProjectWithPages, updateProjectWithPages } = useProject();
  const { optimisticPage, isEditingPage, setEditMode } = usePage();

  const { execute } = useAction(updatePageAction, {
    onError: (error) => {},
  });

  if (!optimisticPage) {
    return null;
  }

  const updatePageServer = ({
    content,
    title,
  }: {
    content?: { content: CustomBlock[] };
    title?: string;
  }) => {
    execute({
      id: optimisticPage.id,
      // @ts-expect-error -- Can't fully reconcile the types
      content,
      title,
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
              debouncedUpdatePageServer({ content });
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
              await updateStepWithLocation({
                stepId: optimisticPage.id,
                data: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  zoom: location.zoom,
                  pitch: location.pitch,
                  bearing: location.bearing,
                },
              }).catch(() => {
                toast("Failed to update location");
                return { success: false };
              });

              return { success: true };
            }}
            onTitleChange={(title: string) => {
              /**
               * This is to update the title in the PagePicker
               */
              startTransition(() => {
                updateProjectWithPages({
                  ...optimisticProjectWithPages,
                  pages: optimisticProjectWithPages.pages.map((page) =>
                    page.id === optimisticPage.id ? { ...page, title } : page
                  ),
                });
              });

              debouncedUpdatePageServer({
                title,
              });
            }}
            points={[]}
          />
        </div>
      </div>
    </div>
  );
}

// This is to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(Project), { ssr: false });
