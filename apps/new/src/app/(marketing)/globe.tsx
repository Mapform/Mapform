"use client";

import createGlobe from "cobe";
import type { Marker } from "cobe";
import { useEffect, useRef } from "react";

const animateLoop: {
  query: string;
  coordinates: [number, number];
  markers: Marker[];
}[] = [
  {
    query: "Show me the world",
    coordinates: [37.7749, -122.4194],
    markers: [
      { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco, USA
      { location: [40.7128, -74.006], size: 0.05 }, // New York City, USA
      { location: [48.8566, 2.3522], size: 0.05 }, // Paris, France
      { location: [35.6895, 139.6917], size: 0.05 }, // Tokyo, Japan
      { location: [51.5074, -0.1278], size: 0.05 }, // London, UK
      { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney, Australia
      { location: [55.7558, 37.6173], size: 0.05 }, // Moscow, Russia
      { location: [-23.5505, -46.6333], size: 0.05 }, // São Paulo, Brazil
      { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
      { location: [19.4326, -99.1332], size: 0.05 }, // Mexico City, Mexico
      { location: [52.52, 13.405], size: 0.05 }, // Berlin, Germany
      { location: [34.0522, -118.2437], size: 0.05 }, // Los Angeles, USA
      { location: [28.6139, 77.209], size: 0.05 }, // Delhi, India
      { location: [31.2304, 121.4737], size: 0.05 }, // Shanghai, China
      { location: [6.5244, 3.3792], size: 0.05 }, // Lagos, Nigeria
    ],
  },
  {
    query: "What are the best restaurants in Tokyo?",
    coordinates: [35.6895, 139.6917],
    markers: [{ location: [35.6895, 139.6917], size: 0.05 }],
  },
];

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const focusRef = useRef<[number, number]>([0, 0]);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    // Current angles for globe orientation
    let currentPhi = 0;
    let currentTheta = 0.3;
    let width = 0;
    let dpr = 1;

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
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: currentPhi,
      theta: currentTheta,
      dark: 0,
      diffuse: 0.5,
      mapSamples: 30000,
      mapBrightness: 2.5,
      mapBaseBrightness: 0.1,
      opacity: 0.8,
      scale: 1.2,
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
    const first = animateLoop[0];
    if (first) {
      const [lat, lon] = first.coordinates;
      focusRef.current = locationToAngles(lat, lon);
      markersRef.current = first.markers;
    }

    // Advance focus over time instead of using globe.flyTo
    let index = 0;
    const intervalId = window.setInterval(() => {
      if (animateLoop.length === 0) return;
      index = (index + 1) % animateLoop.length;
      const item = animateLoop[index];
      if (!item) return;
      const [lat, lon] = item.coordinates;
      focusRef.current = locationToAngles(lat, lon);
      markersRef.current = item.markers;
    }, 2000);

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
        aspectRatio: 1,
        flex: 1,
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
