import type { viewTypes } from "@mapform/db/schema";
import { MapIcon, Table2Icon, type LucideIcon } from "lucide-react";

export const VIEWS: Record<
  (typeof viewTypes.enumValues)[number],
  {
    name: string;
    icon: LucideIcon;
  }
> = {
  map: {
    name: "Map",
    icon: MapIcon,
  },
  table: {
    name: "Table",
    icon: Table2Icon,
  },
};
