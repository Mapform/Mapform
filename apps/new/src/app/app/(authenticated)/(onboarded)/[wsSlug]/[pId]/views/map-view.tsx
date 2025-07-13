import { useParamsContext } from "~/lib/params/client";
import { useProject } from "../context";
import { useMap } from "react-map-gl/mapbox";

export function MapView() {
  const { map } = useMap();
  const { projectService } = useProject();
  const { setQueryStates } = useParamsContext();

  return (
    <ul className="flex list-none flex-col gap-2 p-0">
      {projectService.optimisticState.rows.map((row) => (
        <li
          key={row.id}
          className="m-0 cursor-pointer rounded-lg border p-2 transition-colors hover:border-gray-300 hover:bg-gray-50"
          onClick={() => {
            void setQueryStates({ rowId: row.id });

            map?.flyTo({
              center: row.center.coordinates as [number, number],
              duration: 500,
            });
          }}
        >
          {row.name}
        </li>
      ))}
    </ul>
  );
}
