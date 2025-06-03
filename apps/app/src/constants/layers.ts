import type { Layer } from "@mapform/db/schema";
import {
  CircleDotIcon,
  MapPinIcon,
  PentagonIcon,
  SplineIcon,
  type LucideIcon,
} from "lucide-react";

export const LAYERS: Record<
  Layer["type"],
  {
    icon: LucideIcon;
    label: string;
  }
> = {
  point: {
    icon: CircleDotIcon,
    label: "Point",
  },
  marker: {
    icon: MapPinIcon,
    label: "Marker",
  },
  line: {
    icon: SplineIcon,
    label: "Line",
  },
  polygon: {
    icon: PentagonIcon,
    label: "Polygon",
  },
};
