"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { MapForm } from "@mapform/mapform";
import { debounce } from "@mapform/lib/lodash";
import { compressImage } from "~/lib/compress-image";
import { env } from "~/env.mjs";
import { useProject } from "../project-context";
import { EditBar } from "./edit-bar";

function Project() {
  const {
    currentPage,
    selectedFeature,
    currentPageData,
    updatePageServer,
    upsertCellServer,
    projectWithPages,
    uploadImageServer,
    updatePageOptimistic,
    updateSelectedFeatureOptimistic,
  } = useProject();

  /**
   * NOTE: Optimistic updates DO NOT work with debounced server actions. To work
   * around this either:
   * - Pick one or the other
   * - Add uncontrolled state to the component where it optimistic updates are
   *   needed. For instance, the Blocknote richtext in an uncontrolled
   *   component.
   */

  // These need to be separate because if a title and description change are
  // made quickly (within the debounce time), the update of the
  // second would overwrite the first.
  const debouncedUpdatePageTitle = useCallback(
    debounce(updatePageServer.execute, 2000),
    [updatePageServer],
  );
  const debouncedUpdatePageDescription = useCallback(
    debounce(updatePageServer.execute, 2000),
    [updatePageServer],
  );
  const debouncedUpdateCellRichtext = useCallback(
    debounce(upsertCellServer.execute, 2000),
    [upsertCellServer],
  );
  const debouncedUpdateCellString = useCallback(
    debounce(upsertCellServer.execute, 2000),
    [upsertCellServer],
  );

  if (!currentPage) {
    return null;
  }

  const submissionColBlockIds =
    projectWithPages.submissionsDataset?.columns.map((c) => c.blockNoteId) ??
    [];

  return (
    <div className="flex flex-1 justify-center overflow-hidden p-4">
      <div className="flex flex-1">
        <MapForm
          currentPage={currentPage}
          editable
          includeFormBlocks={
            projectWithPages.formsEnabled && currentPage.pageType === "page"
          }
          submissionColBlockIds={submissionColBlockIds}
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          onDescriptionChange={(content, type) => {
            if (type === "page") {
              debouncedUpdatePageDescription({ id: currentPage.id, content });
              return;
            }

            if (!selectedFeature?.description) {
              return;
            }

            debouncedUpdateCellRichtext({
              type: "richtext",
              value: content,
              rowId: selectedFeature.rowId,
              columnId: selectedFeature.description.columnId,
            });
          }}
          onIconChange={(icon, type) => {
            if (type === "page") {
              updatePageOptimistic({
                ...currentPage,
                icon,
              });

              updatePageServer.execute({
                id: currentPage.id,
                icon,
              });

              return;
            }

            if (!selectedFeature?.icon || !currentPageData) {
              return;
            }

            if (selectedFeature.icon.iconCell) {
              updateSelectedFeatureOptimistic({
                ...selectedFeature,
                icon: {
                  ...selectedFeature.icon,
                  iconCell: {
                    ...selectedFeature.icon.iconCell,
                    value: icon,
                  },
                },
              });
            }

            upsertCellServer.execute({
              type: "icon",
              value: icon,
              rowId: selectedFeature.rowId,
              columnId: selectedFeature.icon.columnId,
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

            const response = await uploadImageServer.executeAsync(formData);

            if (response?.serverError) {
              return null;
            }

            return response?.data?.url || null;
          }}
          onTitleChange={(title, type) => {
            if (type === "page") {
              debouncedUpdatePageTitle({
                id: currentPage.id,
                title,
              });

              return;
            }

            if (!selectedFeature?.title) {
              return;
            }

            debouncedUpdateCellString({
              type: "string",
              value: title,
              rowId: selectedFeature.rowId,
              columnId: selectedFeature.title.columnId,
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
