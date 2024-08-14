import React from "react";
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
  items,
  layerIndex,
}: {
  items: {
    id: string;
    name?: string;
    isPlaceholder: boolean;
    colSpan: number;
  }[];
  layerIndex: number;
}) {
  const { formWithSteps, currentDataTrack, setQueryParamFor } =
    useContainerContext();
  const { execute } = useAction(createDataTrack);

  const onAddDataTrack = (startStepIndex: number, endStepIndex: number) => {
    execute({
      formId: formWithSteps.id,
      startStepIndex,
      endStepIndex,
      layerIndex,
    });
  };

  return (
    <SortableContext
      id={layerIndex.toString()}
      items={items}
      strategy={horizontalListSortingStrategy}
    >
      {items.map((item, index) => {
        if (item.isPlaceholder) {
          return (
            <td
              className="whitespace-nowrap text-sm text-stone-700"
              key={item.id}
              style={{ gridRow: layerIndex + 2 }}
            >
              <Draggable id={item.id} key={item.id}>
                <button
                  className="w-full h-8 flex justify-center items-center bg-blue-100 rounded-md opacity-0 hover:opacity-100 relative"
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
          <div
            className={cn("whitespace-nowrap text-sm text-stone-700", {
              "col-span-2": item.colSpan > 1,
            })}
            key={item.id}
            style={{ gridRow: layerIndex + 2 }}
          >
            <DatatrackDrawerRoot
              onOpenChange={(isOpen) => {
                if (!isOpen && currentDataTrack?.id === item.id)
                  setQueryParamFor("d");
              }}
              open={currentDataTrack?.id === item.id}
            >
              <Draggable id={item.id} key={item.id}>
                <button
                  className={cn(
                    "flex relative px-3 rounded-md text-md h-8 w-full text-blue-950 bg-blue-100",
                    {
                      "ring-2 ring-offset-2 ring-blue-600":
                        currentDataTrack?.id === item.id,
                    }
                  )}
                  onClick={() => {
                    if (currentDataTrack?.id === item.id) {
                      setQueryParamFor("d");
                      return;
                    }
                    setQueryParamFor("d", item.id);
                  }}
                  type="button"
                >
                  <div className="flex-1 h-full flex justify-center items-center bg-blue-300">
                    <span className="line-clambreak-words px-1 text-sm">
                      {item.name || "Untitled"}
                    </span>
                  </div>
                </button>
              </Draggable>
              <DatatrackContent />
            </DatatrackDrawerRoot>
          </div>
        );
      })}
    </SortableContext>
  );
}
