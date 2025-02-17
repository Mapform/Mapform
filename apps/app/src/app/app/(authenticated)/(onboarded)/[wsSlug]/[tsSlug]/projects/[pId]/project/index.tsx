"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { debounce } from "@mapform/lib/lodash";
import { compressImage } from "~/lib/compress-image";
import { useProject } from "../project-context";
import { EditBar } from "./edit-bar";
import {
  MapformContent,
  MapformDrawer,
  MapformDrawerButton,
  MapformMap,
} from "~/components/mapform";
import { CustomBlockProvider, type CustomBlock } from "@mapform/blocknote";
import { Blocknote } from "~/components/mapform/block-note";
import { LocationSearchDrawer } from "./location-search-drawer";

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

  const [drawerValues, setDrawerValues] = useState<string[]>([
    "page-content",
    ...(selectedFeature ? ["feature"] : []),
  ]);

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

  return (
    <div className="flex flex-1 justify-center overflow-hidden p-4">
      <div className="flex flex-1">
        <MapformContent
          isEditing
          drawerValues={drawerValues}
          onDrawerValuesChange={setDrawerValues}
          pageData={currentPageData}
        >
          <CustomBlockProvider
            isEditing
            imageBlock={{
              onImageUpload: async (file: File) => {
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
              },
            }}
          >
            <MapformDrawer
              onClose={() => {
                setDrawerValues(
                  drawerValues.filter((v) => v !== "page-content"),
                );
              }}
              value="page-content"
            >
              <Blocknote
                description={currentPage.content as { content: CustomBlock[] }}
                icon={currentPage.icon}
                includeFormBlocks={
                  projectWithPages.formsEnabled &&
                  currentPage.pageType === "page"
                }
                key={currentPage.id}
                onDescriptionChange={(val) => {
                  debouncedUpdatePageDescription({
                    id: currentPage.id,
                    content: val,
                  });
                }}
                onIconChange={(val) => {
                  updatePageOptimistic({
                    ...currentPage,
                    icon: val,
                  });

                  updatePageServer.execute({
                    id: currentPage.id,
                    icon: val,
                  });
                }}
                onTitleChange={(val) => {
                  debouncedUpdatePageTitle({
                    id: currentPage.id,
                    title: val,
                  });
                }}
                title={currentPage.title}
              />
            </MapformDrawer>
            <MapformDrawer
              onClose={() => {
                setDrawerValues(drawerValues.filter((v) => v !== "feature"));
              }}
              value="feature"
            >
              <Blocknote
                description={
                  selectedFeature?.description?.richtextCell?.value ?? undefined
                }
                icon={selectedFeature?.icon?.iconCell?.value}
                key={`${currentPage.id}-${selectedFeature?.rowId}`}
                onDescriptionChange={(value) => {
                  if (!selectedFeature?.description) {
                    return;
                  }

                  debouncedUpdateCellRichtext({
                    type: "richtext",
                    value,
                    rowId: selectedFeature.rowId,
                    columnId: selectedFeature.description.columnId,
                  });
                }}
                onIconChange={(value) => {
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
                          value,
                        },
                      },
                    });
                  }

                  upsertCellServer.execute({
                    type: "icon",
                    value,
                    rowId: selectedFeature.rowId,
                    columnId: selectedFeature.icon.columnId,
                  });
                }}
                onTitleChange={(value) => {
                  if (!selectedFeature?.title) {
                    return;
                  }

                  debouncedUpdateCellString({
                    type: "string",
                    value,
                    rowId: selectedFeature.rowId,
                    columnId: selectedFeature.title.columnId,
                  });
                }}
                title={selectedFeature?.title?.stringCell?.value}
              />
            </MapformDrawer>
            <LocationSearchDrawer currentPage={currentPage} />
            {/* <MarkerEditDrawer currentPage={currentPage} /> */}
          </CustomBlockProvider>
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
          >
            <EditBar key={currentPage.id} />
          </MapformMap>
        </MapformContent>
        {/* <MapForm
          currentPage={currentPage}
          isEditing
          includeFormBlocks={
            projectWithPages.formsEnabled && currentPage.pageType === "page"
          }
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
        </MapForm> */}
      </div>
    </div>
  );
}

// This is to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(Project), { ssr: false });
