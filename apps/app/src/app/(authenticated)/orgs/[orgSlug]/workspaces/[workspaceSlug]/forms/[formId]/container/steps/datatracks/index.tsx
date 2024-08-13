import React, { useState, useCallback } from "react";
import {
  useSensor,
  useSensors,
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useContainerContext } from "../../context";
import { Row } from "./row";

export function DataTracks() {
  const { formWithSteps, dragSteps } = useContainerContext();
  const getRowItems = useCallback(
    (
      layerIndex: number
    ): {
      id: string;
      name?: string;
      isPlaceholder: boolean;
      colSpan: number;
    }[] => {
      return new Array(dragSteps.length)
        .fill(null)
        .map((_, index) => {
          const currentRowDataTracks = formWithSteps.dataTracks.filter(
            (dataTrack) => dataTrack.layerIndex === layerIndex
          );
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
        .reduce((acc: any, curr: any) => {
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
        }, []);
    },
    [dragSteps.length, formWithSteps.dataTracks]
  );

  const [items, setItems] = useState({
    "0": getRowItems(0),
    "1": getRowItems(1),
  });
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  };

  const findContainer = (id: UniqueIdentifier): "0" | "1" => {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) =>
      items[key].find((item) => item.id === id)
    );
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex((item) => item.id === id);
      const overIndex = overItems.findIndex((item) => item.id === overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      console.log(11111, activeIndex, overIndex, newIndex);

      return prev;

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].findIndex(
      (item) => item.id === active.id
    );
    const overIndex = items[overContainer].findIndex(
      (item) => item.id === overId
    );

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveId(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Row items={items[0]} layerIndex={0} />
      <Row items={items[1]} layerIndex={1} />
    </DndContext>
  );
}
