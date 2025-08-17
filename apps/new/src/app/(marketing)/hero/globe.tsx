"use client";

import createGlobe from "cobe";
import type { Marker } from "cobe";
import { useEffect, useRef } from "react";

interface GlobeProps {
  target: {
    coordinates: [number, number];
    markers: {
      location: [number, number];
      size?: number;
    }[];
  };
}

const locationToAngles = (lat: number, lon: number) => {
  return [
    Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];
};

export function Globe({ target }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const focusRef = useRef<[number, number]>([0, 0]);
  const markersRef = useRef<Marker[]>([]);
  // Helpers are kept outside of effects to avoid extra dependencies
  const twoPi = Math.PI * 2;

  useEffect(() => {
    // Current angles for globe orientation
    let currentPhi = 0;
    let currentTheta = 0.3;
    let width = 0;

    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) {
      return;
    }

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      scale: 1.2,
      phi: currentPhi,
      theta: currentTheta,
      dark: 0,
      diffuse: 0.5,
      mapSamples: 30000,
      mapBrightness: 2.5,
      mapBaseBrightness: 0.1,
      opacity: 0.8,
      baseColor: [1, 1, 1],
      markerColor: [59 / 255, 130 / 255, 246 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: markersRef.current,
      onRender: (state) => {
        // Easing towards target focus angles
        const [focusPhi, focusTheta] = focusRef.current;

        const distPositive = (focusPhi - currentPhi + twoPi) % twoPi;
        const distNegative = (currentPhi - focusPhi + twoPi) % twoPi;
        if (distPositive < distNegative) {
          currentPhi += distPositive * 0.08;
        } else {
          currentPhi -= distNegative * 0.08;
        }
        currentTheta = currentTheta * 0.92 + focusTheta * 0.08;

        state.phi = currentPhi;
        state.theta = currentTheta;
        state.markers = markersRef.current;

        // Keep internal resolution synced with CSS size * DPR
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(
      () => canvasRef.current && (canvasRef.current.style.opacity = "1"),
    );
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [twoPi]);

  // Update focus and markers whenever the target changes
  useEffect(() => {
    const [lat, lon] = target.coordinates;
    focusRef.current = locationToAngles(lat, lon) as [number, number];

    // Immediately set all markers (no delayed reveal)
    markersRef.current = target.markers.map((marker) => ({
      location: marker.location,
      size: marker.size ?? 0.1,
    }));
  }, [target]);

  return (
    <div
      className="aspect-w-1 aspect-h-1"
      style={{
        width: "100%",
        maxWidth: 800,
        aspectRatio: 1,
        margin: "auto",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
