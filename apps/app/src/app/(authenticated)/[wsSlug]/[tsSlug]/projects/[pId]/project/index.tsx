"use client";

import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import { toast } from "@mapform/ui/components/toaster";
import type { CustomBlock } from "@mapform/blocknote";
import { useAction } from "next-safe-action/hooks";
import { debounce } from "@mapform/lib/lodash";
import { cn } from "@mapform/lib/classnames";
import { uploadImage } from "~/data/images";
import { updatePage as updatePageAction } from "~/data/pages/update-page";
import { env } from "~/env.mjs";
import { usePage } from "../page-context";
import { AddLocationDropdown } from "./add-location-dropdown";
import { EditBar } from "./edit-bar";

function Project() {
  const { optimisticPage, optimisticPageData } = usePage();

  const { executeAsync } = useAction(updatePageAction);

  if (!optimisticPage) {
    return null;
  }

  const updatePageServer = async ({
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
    await executeAsync({
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
    <div className="flex flex-1 justify-center overflow-hidden p-4">
      <div className="flex flex-1">
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
          onTitleChange={(title: string) => {
            void debouncedUpdatePageServer({
              title,
            });
          }}
          pageData={optimisticPageData}
        >
          <div
            className={cn(
              "bg-primary absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center rounded-lg px-2 py-0",
              optimisticPage.contentViewType === "split"
                ? "left-1/2 md:left-[calc(50%+180px)]"
                : "left-1/2",
            )}
          >
            <EditBar
              key={optimisticPage.id}
              updatePageServer={updatePageServer}
            />
          </div>
        </MapForm>
      </div>
    </div>
  );
}

// This is to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(Project), { ssr: false });
