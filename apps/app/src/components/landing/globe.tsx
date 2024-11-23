"use client";

import createGlobe from "cobe";
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
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 0.5,
      mapSamples: 30000,
      mapBrightness: 2.5,
      mapBaseBrightness: 0.1,
      opacity: 0.8,
      baseColor: [1, 1, 1],
      markerColor: [255, 255, 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: [],
      onRender: (state) => {
        // This prevents rotation while dragging
        if (!pointerInteracting.current) {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          phi += 0.001;
        }
        state.phi = phi + spring.get();
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
  }, []);
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        aspectRatio: 1,
        margin: "auto",
        position: "relative",
      }}
    >
      <canvas
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            spring.set(delta / 200);
          }
        }}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          canvasRef.current && (canvasRef.current.style.cursor = "grabbing");
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current && (canvasRef.current.style.cursor = "grab");
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current && (canvasRef.current.style.cursor = "grab");
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            spring.set(delta / 200);
          }
        }}
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
