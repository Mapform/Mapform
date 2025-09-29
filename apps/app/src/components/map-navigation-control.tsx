"use client";

import React, { useEffect, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { Plus, Minus, NavigationOffIcon, NavigationIcon } from "lucide-react";
import Image from "next/image";
import Compass from "public/static/images/compass.svg";
import { cn } from "@mapform/lib/classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  className?: string;
};

function ControlButton({ label, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-md border bg-white/95 shadow-sm backdrop-blur-sm transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function MapNavigationControl() {
  const mapRef = useMap();
  const map = mapRef.current;
  const [bearing, setBearing] = useState(0);

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

  const handleLocate = () => {
    console.log("handleLocate", "geolocation" in navigator);
    if (!map) return;
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.easeTo({
          center: [longitude, latitude],
          zoom: Math.max(12, map.getZoom()),
          duration: 600,
        });
      },
      () => {
        // noop on error
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  };

  return (
    <div className="pointer-events-auto absolute right-2 top-2 z-[1] flex flex-col gap-2">
      <div
        role="group"
        aria-label="Zoom controls"
        className="inline-flex flex-col overflow-hidden rounded-md border bg-white/95 shadow-sm backdrop-blur-sm"
      >
        <ControlButton
          label="Zoom in"
          onClick={handleZoomIn}
          className="rounded-none border-0 bg-transparent hover:bg-black/5"
        >
          <Plus className="size-4" />
        </ControlButton>
        <div className="h-px w-full bg-black/10" />
        <ControlButton
          label="Zoom out"
          onClick={handleZoomOut}
          className="rounded-none border-0 bg-transparent hover:bg-black/5"
        >
          <Minus className="size-4" />
        </ControlButton>
      </div>
      <div className="flex flex-col gap-2">
        <ControlButton label="My location" onClick={handleLocate}>
          {"geolocation" in navigator ? (
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
          <div className="relative size-8">
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
              <Image src={Compass} alt="Compass" className="size-[22px]" />
            </div>
          </div>
        </ControlButton>
      </div>
    </div>
  );
}

export default MapNavigationControl;
