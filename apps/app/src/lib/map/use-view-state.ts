import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { DRAWER_WIDTH, SIDEBAR_WIDTH } from "~/constants/sidebars";
import { useParamsContext } from "~/lib/params/client";

export interface ViewState {
  zoom: number;
  pitch: number;
  bearing: number;
  center: [number, number];
}

export function useViewState(viewState?: Partial<ViewState>) {
  const pathParams = useParams<{
    pId?: string;
  }>();
  const pathname = usePathname();
  const { params } = useParamsContext();
  const isSettings = pathname.includes("/settings");

  const paddingSegments = useMemo(
    () => [
      SIDEBAR_WIDTH,
      ...(params.chatId ||
      params.search ||
      params.rowId ||
      params.stadiaId ||
      params.marker ||
      pathParams.pId ||
      isSettings
        ? [DRAWER_WIDTH]
        : []),
    ],
    [
      params.chatId,
      params.search,
      params.rowId,
      params.stadiaId,
      params.marker,
      pathParams.pId,
      isSettings,
    ],
  );

  const totalPadding = useMemo(() => {
    return paddingSegments.reduce((acc, curr) => acc + curr, 0);
  }, [paddingSegments]);

  const viewStateCenter = viewState?.center;
  const viewStateZoom = viewState?.zoom;
  const viewStatePitch = viewState?.pitch;
  const viewStateBearing = viewState?.bearing;

  const memoizedViewState = useMemo(() => {
    let derivedCenter: [number, number] | undefined;
    if (params.location) {
      const [longitudeString, latitudeString] = params.location.split(",");
      const latitude = Number(latitudeString);
      const longitude = Number(longitudeString);
      if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
        derivedCenter = [latitude, longitude];
      }
    }

    return {
      zoom: params.zoom ?? viewStateZoom,
      center: derivedCenter ?? viewStateCenter,
      pitch: params.pitch ?? viewStatePitch,
      bearing: params.bearing ?? viewStateBearing,
      padding: {
        left: totalPadding,
        right: 0,
        top: 0,
        bottom: 0,
      },
    };
  }, [
    params.location,
    params.zoom,
    params.pitch,
    params.bearing,
    viewStateCenter,
    viewStateZoom,
    viewStatePitch,
    viewStateBearing,
    totalPadding,
  ]);

  return memoizedViewState;
}
