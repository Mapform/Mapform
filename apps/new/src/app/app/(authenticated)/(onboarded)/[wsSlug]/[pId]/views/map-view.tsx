import { useParamsContext } from "~/lib/params/client";
import { useProject } from "../context";
import { useMap } from "react-map-gl/mapbox";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export function MapView() {
  const map = useMap();
  const { projectService } = useProject();
  const { setQueryStates } = useParamsContext();

  return (
    <ul className="flex list-none flex-col gap-2 p-0">
      {projectService.optimisticState.rows.map((row) => (
        <li
          key={row.id}
          className="m-0 flex cursor-pointer overflow-hidden rounded-lg border pl-0 transition-colors hover:border-gray-300 hover:bg-gray-50"
          onClick={() => {
            void setQueryStates({ rowId: row.id });

            map.current?.flyTo({
              center: row.center.coordinates as [number, number],
              duration: 1000,
            });
          }}
        >
          <div className="bg-muted relative flex size-16 items-center justify-center">
            {row.blobs[0]?.url ? (
              <Image
                src={row.blobs[0].url}
                alt={row.name ?? ""}
                fill
                objectFit="cover"
                className="m-0"
              />
            ) : (
              <ImageIcon className="size-4 text-gray-400" />
            )}
          </div>
          <div className="flex flex-1 items-center truncate p-2">
            <div className="mr-1">{row.icon}</div>
            <h6 className="m-0 font-medium">{row.name}</h6>
          </div>
        </li>
      ))}
    </ul>
  );
}
