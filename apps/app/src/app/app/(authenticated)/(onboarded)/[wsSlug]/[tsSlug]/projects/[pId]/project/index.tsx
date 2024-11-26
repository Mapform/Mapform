"use client";

import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import { toast } from "@mapform/ui/components/toaster";
import type { CustomBlock } from "@mapform/blocknote";
import { useAction } from "next-safe-action/hooks";
import { debounce } from "@mapform/lib/lodash";
import { uploadImageAction } from "~/data/images";
import { updatePageAction } from "~/data/pages/update-page";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import { compressImage } from "~/lib/compress-image";
import { env } from "~/env.mjs";
import { usePage } from "../page-context";
import { useProject } from "../project-context";
import { EditBar } from "./edit-bar";

function Project() {
  const { layerPoint } = useProject();
  const { optimisticPage, optimisticPageData } = usePage();

  const { executeAsync: executeAsyncUpdatePage } = useAction(updatePageAction, {
    onError: (response) => {
      if (response.error.validationErrors || response.error.serverError) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "An error occurred while updating the page.",
        });
      }
    },
  });
  const { execute: executeUpsertCell } = useAction(upsertCellAction);
  const { executeAsync: executeAsyncUploadImage } = useAction(
    uploadImageAction,
    {
      onError: (response) => {
        if (response.error.validationErrors) {
          toast({
            title: "Uh oh! Something went wrong.",
            description: response.error.validationErrors.image?._errors?.[0],
          });

          return;
        }

        toast({
          title: "Uh oh! Something went wrong.",
          description: "An error occurred while uploading the image.",
        });
      },
    },
  );

  if (!optimisticPage) {
    return null;
  }

  const updatePageServer = async ({
    content,
    title,
    icon,
    zoom,
    pitch,
    bearing,
    center,
  }: {
    content?: { content: CustomBlock[] };
    title?: string;
    icon?: string | null;
    zoom?: number;
    pitch?: number;
    bearing?: number;
    center?: { x: number; y: number };
  }) => {
    await executeAsyncUpdatePage({
      id: optimisticPage.id,
      ...(content !== undefined && { content }),
      ...(title !== undefined && { title }),
      ...(icon !== undefined && { icon }),
      ...(zoom !== undefined && { zoom }),
      ...(pitch !== undefined && { pitch }),
      ...(bearing !== undefined && { bearing }),
      ...(center !== undefined && { center }),
    });
  };

  const debouncedUpdatePageServer = debounce(updatePageServer, 2000);
  const debouncedUpsertCell = debounce(executeUpsertCell, 2000);

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
          onIconChange={(icon: string | null) => {
            void debouncedUpdatePageServer({
              icon,
            });
          }}
          onImageUpload={async (file: File) => {
            const compressedFile = await compressImage(
              file,
              0.8,
              2000,
              2000,
              1000,
            );
            const formData = new FormData();
            formData.append("image", compressedFile);

            const response = await executeAsyncUploadImage(formData);

            if (response?.serverError) {
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
          <EditBar
            key={optimisticPage.id}
            updatePageServer={updatePageServer}
          />
        </MapForm>
      </div>
    </div>
  );
}

// This is to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(Project), { ssr: false });
