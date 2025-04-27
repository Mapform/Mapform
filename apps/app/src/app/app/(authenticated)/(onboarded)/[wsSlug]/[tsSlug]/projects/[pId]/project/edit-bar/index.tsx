import { cn } from "@mapform/lib/classnames";
import { useMapformContent } from "~/components/mapform";
import { useState } from "react";
import { HandTool } from "./hand-tool";
import type { lineTypes } from "./line-tool";
import { LineTool } from "./line-tool";
import { MapOptions } from "./map-options";
import { PointTool } from "./point-tool";
import { SearchTool } from "./search-tool";
import { ShapeTool } from "./shape-tool/new";

interface EditBarProps {
  onSearchOpenChange: (isOpen: boolean) => void;
}

export function EditBar({ onSearchOpenChange }: EditBarProps) {
  const { drawerValues } = useMapformContent();
  const isSearchOpen = drawerValues.includes("location-search");
  const [activeTool, setActiveTool] = useState<
    "hand" | "point" | "line" | "shape"
  >("hand");
  const [selectedLineType, setSelectedLineType] =
    useState<keyof typeof lineTypes>("line");

  return (
    <div
      className={cn(
        "pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center divide-x rounded-xl border bg-white p-1.5 shadow-lg",
      )}
    >
      <div className="flex gap-1 pr-1.5">
        <SearchTool
          isActive={isSearchOpen}
          onClick={() => {
            if (!isSearchOpen) {
              onSearchOpenChange(true);
            }
          }}
        />
      </div>
      <div className="flex gap-1 px-1.5">
        <HandTool
          isActive={activeTool === "hand" && !isSearchOpen}
          isSearchOpen={isSearchOpen}
          onClick={() => {
            setActiveTool("hand");
            onSearchOpenChange(false);
          }}
        />
        <PointTool
          isActive={activeTool === "point" && !isSearchOpen}
          isSearchOpen={isSearchOpen}
          onClick={() => {
            setActiveTool("point");
            onSearchOpenChange(false);
          }}
        />
        <LineTool
          selectedLineType={selectedLineType}
          setSelectedLineType={setSelectedLineType}
          isActive={activeTool === "line" && !isSearchOpen}
          isSearchOpen={isSearchOpen}
          onClick={() => {
            setActiveTool("line");
            onSearchOpenChange(false);
          }}
        />
        <ShapeTool
          isActive={activeTool === "shape" && !isSearchOpen}
          isSearchOpen={isSearchOpen}
          onClick={() => {
            setActiveTool("shape");
            onSearchOpenChange(false);
          }}
        />
      </div>
      <div className="flex gap-1 pl-1.5">
        <MapOptions />
      </div>
    </div>
  );
}
