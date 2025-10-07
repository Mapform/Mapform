"use client";

import React, { useEffect, useState } from "react";
import { Marker, useMap } from "react-map-gl/maplibre";
import { Plus, Minus, NavigationOffIcon, NavigationIcon } from "lucide-react";
import Image from "next/image";
import Compass from "public/static/images/compass.svg";
import { Button } from "@mapform/ui/components/button";
import { useGeolocation } from "@mapform/lib/hooks/use-geolocation";
import { useRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  className?: string;
};

function ControlButton({ label, className, ...props }: ButtonProps) {
  return (
    <Button
      type="button"
      aria-label={label}
      title={label}
      className={className}
      variant="outline"
      size="icon-sm"
      {...props}
    />
  );
}

export function MapNavigationControl() {
  const mapRef = useMap();
  const map = mapRef.current;
  const [bearing, setBearing] = useState<number>(0);
  const { coords, getCurrentPosition } = useGeolocation();
  const userLocation: { lat: number; lng: number } | null = coords;
  const shouldCenterOnNextFixRef = useRef<boolean>(false);

  useEffect(() => {
    if (!map) return;
    const updateBearing = () => {
      try {
        const b = map.getBearing();
        setBearing(typeof b === "number" ? b : 0);
      } catch {
        // ignore
      }
    };
    updateBearing();
    map.on("move", updateBearing);
    return () => {
      map.off("move", updateBearing);
    };
  }, [map]);

  // Permission state handled by useGeolocation

  const handleZoomIn = () => {
    if (!map) return;
    map.zoomIn({ duration: 200 });
  };

  const handleZoomOut = () => {
    if (!map) return;
    map.zoomOut({ duration: 200 });
  };

  const handleResetNorth = () => {
    if (!map) return;
    map.resetNorth({ duration: 300 });
  };

  // Location retrieval handled by useGeolocation

  const handleLocate = () => {
    if (!map) return;
    shouldCenterOnNextFixRef.current = true;
    void getCurrentPosition();
  };

  useEffect(() => {
    if (!map) return;
    if (!userLocation) return;
    if (!shouldCenterOnNextFixRef.current) return;
    const { lat, lng } = userLocation;
    shouldCenterOnNextFixRef.current = false;
    map.easeTo({
      center: [lng, lat],
      zoom: Math.max(12, map.getZoom()),
      duration: 500,
    });
  }, [map, userLocation]);

  return (
    <>
      <div className="pointer-events-auto fixed right-2 top-2 flex flex-col gap-2">
        <div
          role="group"
          aria-label="Zoom controls"
          className="inline-flex w-8 flex-col divide-y overflow-hidden rounded-md border bg-white shadow-sm"
        >
          <ControlButton
            label="Zoom in"
            onClick={handleZoomIn}
            className="w-full rounded-none border-0 bg-transparent"
          >
            <Plus className="size-4" />
          </ControlButton>
          <ControlButton
            label="Zoom out"
            onClick={handleZoomOut}
            className="w-full rounded-none border-0 bg-transparent"
          >
            <Minus className="size-4" />
          </ControlButton>
        </div>
        <div className="flex flex-col gap-2">
          <ControlButton label="My location" onClick={handleLocate}>
            {coords ? (
              <NavigationIcon className="size-4 text-blue-500" />
            ) : (
              <NavigationOffIcon className="size-4" />
            )}
          </ControlButton>
          <ControlButton
            label="Reset North"
            className="rounded-full"
            onClick={handleResetNorth}
          >
            <div
              className="relative size-8"
              style={{ transform: `rotate(${-bearing}deg)` }}
            >
              <svg
                className="absolute left-1/2 top-1/2 !size-full -translate-x-1/2 -translate-y-1/2"
                viewBox="0 0 32 32"
                width="32"
                height="32"
                style={{ pointerEvents: "none" }}
              >
                {Array.from({ length: 12 }, (_, i) => i * 30).map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  const cx = 16;
                  const cy = 16;
                  const r1 = 12.5; // closer to edge
                  const r2 = 13.75; // near outer edge
                  const x1 = cx + r1 * Math.cos(rad);
                  const y1 = cy + r1 * Math.sin(rad);
                  const x2 = cx + r2 * Math.cos(rad);
                  const y2 = cy + r2 * Math.sin(rad);
                  return (
                    <line
                      key={angle}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(0,0,0,0.2)"
                      strokeWidth="1"
                      strokeLinecap="round"
                      shapeRendering="geometricPrecision"
                    />
                  );
                })}
              </svg>
              <div className="flex h-full w-full items-center justify-center">
                <Image src={Compass} alt="Compass" className="size-5" />
              </div>
            </div>
          </ControlButton>
        </div>
      </div>
      {userLocation !== null && (
        <Marker
          longitude={userLocation.lng}
          latitude={userLocation.lat}
          anchor="center"
        >
          <div className="relative size-8">
            <div className="absolute inset-0 size-full animate-ping rounded-full bg-blue-500" />
            <div className="absolute inset-0 flex size-full items-center justify-center rounded-full border-4 border-white bg-blue-500 shadow-md">
              <NavigationIcon
                className="-mb-[1px] -ml-[1px] size-4 text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </Marker>
      )}
    </>
  );
}

export default MapNavigationControl;
