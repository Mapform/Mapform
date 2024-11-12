"use client";

import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import { toast } from "@mapform/ui/components/toaster";
import type { CustomBlock } from "@mapform/blocknote";
import { useAction } from "next-safe-action/hooks";
import { debounce } from "@mapform/lib/lodash";
import { cn } from "@mapform/lib/classnames";
import { uploadImageAction } from "~/data/images";
import { updatePageAction } from "~/data/pages/update-page";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import { env } from "~/env.mjs";
import { usePage } from "../page-context";
import { useProject } from "../project-context";
import { EditBar } from "./edit-bar";

function Project() {
  const { layerPoint } = useProject();
  const { optimisticPage, optimisticPageData } = usePage();

  const { executeAsync: executeAsyncUpdatePage } = useAction(updatePageAction);
  const { execute: executeUpsertCell } = useAction(upsertCellAction);
  const { executeAsync: executeAsyncUploadImage } =
    useAction(uploadImageAction);

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
    await executeAsyncUpdatePage({
      id: optimisticPage.id,
      ...(content !== undefined && { content }),
      ...(title !== undefined && { title }),
      ...(zoom !== undefined && { zoom }),
      ...(pitch !== undefined && { pitch }),
      ...(bearing !== undefined && { bearing }),
      ...(center !== undefined && { center }),
    });
  };

  const debouncedUpdatePageServer = debounce(updatePageServer, 1000);
  const debouncedUpsertCell = debounce(executeUpsertCell, 1000);

  return (
    <div className="flex flex-1 justify-center overflow-hidden p-4">
      <div className="flex flex-1">
        <MapForm
          activePoint={layerPoint}
          currentPage={optimisticPage}
          editable
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          onDescriptionChange={(content: { content: CustomBlock[] }) => {
            void debouncedUpdatePageServer({ content });
          }}
          onImageUpload={async (file: File) => {
            const formData = new FormData();
            formData.append("image", file);

            const response = await executeAsyncUploadImage(formData);

            if (response?.serverError) {
              toast("There was an error uploading the image.");
              return null;
            }

            return response?.data?.url || null;
          }}
          onPoiCellChange={(cell) => {
            debouncedUpsertCell(cell);
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
              "absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center rounded-lg border bg-white p-1 shadow-lg",
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
