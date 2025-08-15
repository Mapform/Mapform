"use client";

import createGlobe from "@mapform/globe";
import { useEffect, useRef } from "react";
import { useSpring } from "motion/react";

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const spring = useSpring(0, {
    bounce: 0.1,
  });

  useEffect(() => {
    let phi = 0;
    let width = 0;
    let dpr = 1;
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
      phi: 0,
      theta: 0.3,
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
      onRender: (state) => {
        // This prevents rotation while dragging
        if (!pointerInteracting.current) {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          // phi += 0.001;
        }
        // state.phi = phi + spring.get();
        // Keep internal resolution synced with CSS size * DPR
        state.width = width * dpr;
        state.height = width * dpr;
      },
    });

    setTimeout(() => {
      globe.flyTo(37.7749, -122.4194, { duration: 1000 });
    }, 3000);

    setTimeout(
      () => canvasRef.current && (canvasRef.current.style.opacity = "1"),
    );
    return () => {
      globe.destroy();
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
