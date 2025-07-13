import { MapDrawer } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";

export function Feature() {
  const { params, setQueryStates } = useParamsContext();

  return (
    <MapDrawer
      open={!!params.rowId}
      depth={0}
      onClose={() => {
        void setQueryStates({
          rowId: null,
        });
      }}
    >
      Row
    </MapDrawer>
  );
}
