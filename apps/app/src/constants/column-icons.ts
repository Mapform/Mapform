import type { Column } from "@mapform/db/schema";
import {
  CalendarIcon,
  CircleDotIcon,
  HashIcon,
  TextIcon,
  TextQuoteIcon,
  ToggleLeftIcon,
  SmileIcon,
  type LucideIcon,
} from "lucide-react";

export const COLUMN_ICONS: {
  [key in Column["type"]]: LucideIcon;
} = {
  point: CircleDotIcon,
  string: TextIcon,
  number: HashIcon,
  richtext: TextQuoteIcon,
  bool: ToggleLeftIcon,
  date: CalendarIcon,
  icon: SmileIcon,
};
