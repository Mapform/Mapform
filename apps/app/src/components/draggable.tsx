import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@mapform/lib/classnames";

export function DragHandle({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <div
      className={cn("cursor-move", className)}
      {...attributes}
      {...listeners}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}

export function DragItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, transform, transition } = useSortable({
    id,
    transition: {
      duration: 500,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} suppressHydrationWarning>
      {children}
    </div>
  );
}

// New component specifically for SidebarMenuItems
export function DraggableSidebarItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, transform, transition } = useSortable({
    id,
    transition: {
      duration: 500,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} suppressHydrationWarning>
      {children}
    </div>
  );
}

// New component for drag handles that can be used inside SidebarMenuButton
export function SidebarDragHandle({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <div
      className="cursor-move opacity-0 transition-opacity group-hover/menu-item:opacity-100"
      {...attributes}
      {...listeners}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
