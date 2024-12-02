"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { MapForm } from "@mapform/mapform";
import { debounce } from "@mapform/lib/lodash";
import type { CustomBlock } from "@mapform/blocknote";
import { compressImage } from "~/lib/compress-image";
import { env } from "~/env.mjs";
import { useProject } from "../project-context";
import { EditBar } from "./edit-bar";

function Project() {
  const {
    currentPage,
    currentProject,
    selectedFeature,
    currentPageData,
    updatePageServer,
    upsertCellServer,
    uploadImageServer,
    updatePageOptimistic,
    updateProjectOptimistic,
  } = useProject();

  // These need to be separate because if a title and description change are
  // made quickly (within the debounce time), the update of the
  // second would overwrite the first.
  const debouncedUpdatePageTitle = useCallback(
    debounce(updatePageServer, 2000),
    [updatePageServer],
  );
  const debouncedUpdatePageDescription = useCallback(
    debounce(updatePageServer, 2000),
    [updatePageServer],
  );

  if (!currentPage) {
    return null;
  }

  return (
    <div className="flex flex-1 justify-center overflow-hidden p-4">
      <div className="flex flex-1">
        <MapForm
          currentPage={currentPage}
          editable
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          onDescriptionChange={(content: { content: CustomBlock[] }) => {
            debouncedUpdatePageDescription({ id: currentPage.id, content });
          }}
          onIconChange={(icon: string | null) => {
            updatePageOptimistic({
              ...currentPage,
              icon,
            });

            updateProjectOptimistic({
              ...currentProject,
              pages: currentProject.pages.map((p) =>
                p.id === currentPage.id ? { ...p, icon } : p,
              ),
            });

            updatePageServer({
              id: currentPage.id,
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

            const response = await uploadImageServer(formData);

            if (response?.serverError) {
              return null;
            }

            return response?.data?.url || null;
          }}
          onPoiCellChange={(cell) => {
            upsertCellServer(cell);
          }}
          onTitleChange={(title: string) => {
            debouncedUpdatePageTitle({
              id: currentPage.id,
              title,
            });
          }}
          pageData={currentPageData}
          selectedFeature={selectedFeature}
        >
          <EditBar key={currentPage.id} />
        </MapForm>
      </div>
    </div>
  );
}

// This is to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(Project), { ssr: false });
