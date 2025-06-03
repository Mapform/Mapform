declare type Last<T extends any[]> = T extends [...infer _, infer L]
  ? L
  : never;

declare module "@mapbox/mapbox-gl-draw-static-mode";
