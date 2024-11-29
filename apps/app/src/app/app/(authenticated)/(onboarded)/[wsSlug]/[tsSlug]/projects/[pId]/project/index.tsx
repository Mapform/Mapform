"use client";

import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import type { CustomBlock } from "@mapform/blocknote";
import { compressImage } from "~/lib/compress-image";
import { env } from "~/env.mjs";
import { usePage } from "../page-context";
import { useProject } from "../project-context";
import { EditBar } from "./edit-bar";

function Project() {
  const { selectedFeature } = useProject();
  const { currentPage, currentPageData, updatePage } = usePage();

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
            updatePage({ content });
          }}
          onIconChange={(icon: string | null) => {
            updatePage({
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

            // const response = await executeAsyncUploadImage(formData);

            // if (response?.serverError) {
            //   return null;
            // }

            // return response?.data?.url || null;
          }}
          onPoiCellChange={(cell) => {
            // upsertCell(cell);
          }}
          onTitleChange={(title: string) => {
            updatePage({
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
