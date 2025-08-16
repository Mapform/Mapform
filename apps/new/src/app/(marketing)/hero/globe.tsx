"use client";

import createGlobe from "cobe";
import type { Marker } from "cobe";
import { useEffect, useRef } from "react";

interface GlobeProps {
  locationLoop: {
    query: string;
    coordinates: [number, number];
    markers: Marker[];
  }[];
}

export function Globe({ locationLoop }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const focusRef = useRef<[number, number]>([0, 0]);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    // Current angles for globe orientation
    let currentPhi = 0;
    let currentTheta = 0.3;
    let width = 0;
    let dpr = 2;

    const twoPi = Math.PI * 2;
    const normalizeAngle = (a: number) => ((a % twoPi) + twoPi) % twoPi;

    const locationToAngles = (lat: number, lon: number): [number, number] => {
      const latRad = (lat * Math.PI) / 180;
      const lonRad = (lon * Math.PI) / 180;
      const phi = normalizeAngle(Math.PI - lonRad);
      const theta = Math.PI / 2 - latRad;
      return [phi, theta];
    };

    const measure = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.offsetWidth;
      dpr = Math.min(3, window.devicePixelRatio || 1);
    };
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    measure();

    if (!canvasRef.current) {
      return;
    }

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * dpr,
      height: width * dpr,
      // scale: 1.2,
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
        state.width = width * dpr;
        state.height = width * dpr;
      },
    });

    // Initialize focus/markers to first item so we start moving immediately
    const first = locationLoop[0];
    if (first) {
      const [lat, lon] = first.coordinates;
      focusRef.current = locationToAngles(lat, lon);
      markersRef.current = first.markers;
    }

    // Advance focus over time instead of using globe.flyTo
    let index = 0;
    const intervalId = window.setInterval(() => {
      if (locationLoop.length === 0) return;
      index = (index + 1) % locationLoop.length;
      const item = locationLoop[index];
      if (!item) return;
      const [lat, lon] = item.coordinates;
      focusRef.current = locationToAngles(lat, lon);
      markersRef.current = item.markers;
    }, 5000);

    setTimeout(
      () => canvasRef.current && (canvasRef.current.style.opacity = "1"),
    );
    return () => {
      globe.destroy();
      window.clearInterval(intervalId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

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
        // onMouseMove={(e) => {
        //   if (pointerInteracting.current !== null) {
        //     const delta = e.clientX - pointerInteracting.current;
        //     pointerInteractionMovement.current = delta;
        //     spring.set(delta / 200);
        //   }
        // }}
        // onPointerDown={(e) => {
        //   pointerInteracting.current =
        //     e.clientX - pointerInteractionMovement.current;
        //   canvasRef.current && (canvasRef.current.style.cursor = "grabbing");
        // }}
        // onPointerOut={() => {
        //   pointerInteracting.current = null;
        //   canvasRef.current && (canvasRef.current.style.cursor = "grab");
        // }}
        // onPointerUp={() => {
        //   pointerInteracting.current = null;
        //   canvasRef.current && (canvasRef.current.style.cursor = "grab");
        // }}
        // onTouchMove={(e) => {
        //   if (pointerInteracting.current !== null && e.touches[0]) {
        //     const delta = e.touches[0].clientX - pointerInteracting.current;
        //     pointerInteractionMovement.current = delta;
        //     spring.set(delta / 200);
        //   }
        // }}
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
