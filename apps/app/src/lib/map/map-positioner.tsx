"use client";

import { useMap } from "react-map-gl/maplibre";
import { useViewState, type ViewState } from "~/lib/map/use-view-state";
import { useEffect, useRef } from "react";
import { useParamsContext } from "../params/client";

type Padding = { left: number; right: number; top: number; bottom: number };
type ComputedViewState = {
  zoom?: number;
  pitch?: number;
  bearing?: number;
  center?: [number, number];
  padding: Padding;
};

function centersEqual(a?: [number, number], b?: [number, number]) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a[0] === b[0] && a[1] === b[1];
}

function paddingsEqual(a: Padding, b: Padding) {
  return (
    a.left === b.left &&
    a.right === b.right &&
    a.top === b.top &&
    a.bottom === b.bottom
  );
}

function viewStatesEqual(a: ComputedViewState, b: ComputedViewState) {
  return (
    a.zoom === b.zoom &&
    a.pitch === b.pitch &&
    a.bearing === b.bearing &&
    centersEqual(a.center, b.center) &&
    paddingsEqual(a.padding, b.padding)
  );
}

interface MapPositionerProps {
  children: React.ReactNode;
  viewState?: Partial<ViewState>;
  // We often want to disable the MapPositioner when the drawer in question is not the active drawer (ie. doesn't have drawerDepth === 0)
  disabled?: boolean;
}

export function MapPositioner({
  children,
  viewState,
  disabled,
}: MapPositionerProps) {
  const map = useMap();
  const _viewState = useViewState(viewState);
  const previousViewStateRef = useRef<ComputedViewState | null>(null);

  useEffect(() => {
    if (!map.current || disabled) return;

    const previous = previousViewStateRef.current;
    const hasChanged =
      !previous || !viewStatesEqual(_viewState as ComputedViewState, previous);

    if (!hasChanged) return;

    map.current.easeTo({
      padding: _viewState.padding,
      ...(_viewState.center !== undefined && { center: _viewState.center }),
      ...(_viewState.pitch !== undefined && { pitch: _viewState.pitch }),
      ...(_viewState.bearing !== undefined && { bearing: _viewState.bearing }),
      ...(_viewState.zoom !== undefined && { zoom: _viewState.zoom }),
    });

    previousViewStateRef.current = _viewState as ComputedViewState;
  }, [_viewState, map, disabled]);

  return <>{children}</>;
}

export function ServerMapPositioner({
  children,
  viewState,
}: Omit<MapPositionerProps, "disabled">) {
  const { drawerDepth } = useParamsContext();

  return (
    <MapPositioner viewState={viewState} disabled={drawerDepth.size > 0}>
      {children}
    </MapPositioner>
  );
}
