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
        "flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white/95 shadow-sm backdrop-blur-sm transition-colors",
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
    <div className="pointer-events-auto absolute right-3 top-3 z-[1] flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <ControlButton label="Zoom in" onClick={handleZoomIn}>
          <Plus className="size-4" />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={handleZoomOut}>
          <Minus className="size-4" />
        </ControlButton>
      </div>
      <div className="flex flex-col gap-2">
        <ControlButton
          label="Reset North"
          className="rounded-full"
          onClick={handleResetNorth}
        >
          <Image
            src={Compass}
            alt="Compass"
            className="size-5"
            style={{
              transform: `rotate(${-bearing}deg)`,
            }}
          />
        </ControlButton>
        <ControlButton label="My location" onClick={handleLocate}>
          {"geolocation" in navigator ? (
            <NavigationIcon className="size-4 text-blue-500" />
          ) : (
            <NavigationOffIcon className="size-4" />
          )}
        </ControlButton>
      </div>
    </div>
  );
}

export default MapNavigationControl;
