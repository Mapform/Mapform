import React, { useMemo } from "react";
import { cn } from "@mapform/lib/classnames";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createDataTrack } from "~/data/datatracks/create-datatrack";
import { useContainerContext } from "../../../context";
import {
  DatatrackContent,
  DatatrackDrawerRoot,
} from "../../../datatrack-drawer";
import { Draggable } from "../../../draggable";

export function Row({
  status,
  layerIndex,
}: {
  layerIndex: number;
  status: string;
}) {
  const { dragSteps, formWithSteps, currentDataTrack, setQueryParamFor } =
    useContainerContext();
  const { execute } = useAction(createDataTrack);

  const currentRowDataTracks = formWithSteps.dataTracks.filter(
    (dataTrack) => dataTrack.layerIndex === layerIndex
  );

  const onAddDataTrack = (startStepIndex: number, endStepIndex: number) => {
    execute({
      formId: formWithSteps.id,
      startStepIndex,
      endStepIndex,
      layerIndex,
    });
  };

  const trackSlots = useMemo(
    () =>
      new Array(dragSteps.length)
        .fill(null)
        .map((_, index) => {
          // Check if index is within the range of any data track
          const dataTrack = currentRowDataTracks.find(
            (track) =>
              index >= track.startStepIndex && index < track.endStepIndex
          );

          if (dataTrack) {
            return {
              id: dataTrack.id,
              name: dataTrack.name,
              isPlaceholder: false,
            };
          }

          return {
            id: Math.random().toString(36).substring(7),
            isPlaceholder: true,
          };
        })
        .reduce((acc, curr) => {
          // Group non-placeholder items with same ID together
          const lastItem = acc[acc.length - 1];

          if (lastItem?.id === curr.id) {
            acc.pop();
            return [
              ...acc,
              {
                ...lastItem,
                colSpan: lastItem.colSpan + 1,
              },
            ];
          }

          return [
            ...acc,
            {
              ...curr,
              colSpan: 1,
            },
          ];
        }, []),
    [currentRowDataTracks, dragSteps.length]
  );

  return (
    <tr>
      <SortableContext
        id={layerIndex.toString()}
        items={trackSlots}
        strategy={horizontalListSortingStrategy}
      >
        {trackSlots.map((dataTrack, index) => {
          if (dataTrack.isPlaceholder) {
            return (
              <td
                className="whitespace-nowrap p-1 text-sm text-stone-700 w-48 min-w-40"
                key={dataTrack.id}
              >
                <Draggable id={dataTrack.id} key={dataTrack.id}>
                  <button
                    className="w-full h-8 flex justify-center items-center bg-blue-100 rounded-md opacity-0 hover:opacity-100 relative"
                    disabled={status === "pending"}
                    onClick={() => {
                      onAddDataTrack(index, index + 1, layerIndex);
                    }}
                  >
                    <PlusIcon className="text-blue-950 h-5 w-5" />
                  </button>
                </Draggable>
              </td>
            );
          }

          return (
            <td
              className={cn(
                "whitespace-nowrap p-1 text-sm text-stone-700 w-48 min-w-40"
              )}
              colSpan={dataTrack.colSpan}
              key={dataTrack.id}
            >
              <DatatrackDrawerRoot
                onOpenChange={(isOpen) => {
                  if (!isOpen && currentDataTrack?.id === dataTrack.id)
                    setQueryParamFor("d");
                }}
                open={currentDataTrack?.id === dataTrack.id}
              >
                <Draggable id={dataTrack.id} key={dataTrack.id}>
                  <button
                    className={cn(
                      "flex relative px-3 rounded-md text-md h-8 w-full text-blue-950 bg-blue-100",
                      {
                        "ring-2 ring-offset-2 ring-blue-600":
                          currentDataTrack?.id === dataTrack.id,
                      }
                    )}
                    onClick={() => {
                      if (currentDataTrack?.id === dataTrack.id) {
                        setQueryParamFor("d");
                        return;
                      }
                      setQueryParamFor("d", dataTrack.id);
                    }}
                    type="button"
                  >
                    <div className="flex-1 h-full flex justify-center items-center bg-blue-300">
                      <span className="line-clamp-1 break-words px-1 text-sm">
                        {dataTrack.name || "Untitled"}
                      </span>
                    </div>
                  </button>
                </Draggable>
                <DatatrackContent />
              </DatatrackDrawerRoot>
            </td>
          );
        })}
      </SortableContext>
    </tr>
  );
}
