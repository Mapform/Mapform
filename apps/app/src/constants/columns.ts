import type { columnTypeEnum } from "@mapform/db/schema";
import {
  Calendar1Icon,
  HashIcon,
  TextIcon,
  ToggleLeftIcon,
  type LucideIcon,
} from "lucide-react";

export const COLUMNS: Record<
  (typeof columnTypeEnum.enumValues)[number],
  {
    name: string;
    icon: LucideIcon;
  }
> = {
  string: {
    name: "Text",
    icon: TextIcon,
  },
  number: {
    name: "Number",
    icon: HashIcon,
  },
  bool: {
    name: "Boolean",
    icon: ToggleLeftIcon,
  },
  date: {
    name: "Date",
    icon: Calendar1Icon,
  },
};
