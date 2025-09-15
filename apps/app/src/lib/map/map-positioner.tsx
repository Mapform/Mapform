"use client";

import { useMap } from "react-map-gl/mapbox";
import { useViewState, type ViewState } from "~/lib/map/use-view-state";
import { useEffect } from "react";

export function MapPositioner({
  children,
  viewState,
}: {
  children: React.ReactNode;
  viewState?: Partial<ViewState>;
}) {
  const map = useMap();
  const _viewState = useViewState(viewState);

  useEffect(() => {
    if (!map.current) return;

    map.current.easeTo({
      padding: _viewState.padding,
      ...(_viewState.center && { center: _viewState.center }),
      ...(_viewState.pitch && { pitch: _viewState.pitch }),
      ...(_viewState.bearing && { bearing: _viewState.bearing }),
      ...(_viewState.zoom && { zoom: _viewState.zoom }),
    });
  }, [_viewState]);

  return <>{children}</>;
}
