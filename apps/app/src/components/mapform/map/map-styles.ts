const orange = "#f59e0b";
const white = "#fff";

export const mapStyles = [
  // Polygons
  //   Solid fill
  //   Active state defines color
  {
    id: "gl-draw-polygon-fill",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": [
        "case",
        [
          "any",
          ["==", ["get", "user_active"], "true"],
          ["==", ["get", "active"], "true"],
        ],
        orange,
        ["get", "user_color"],
      ],
      "fill-opacity": 0.1,
    },
  },
  // Lines
  // Polygon
  //   Matches Lines AND Polygons
  //   Active state defines color
  {
    id: "gl-draw-lines",
    type: "line",
    filter: ["any", ["==", "$type", "LineString"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": [
        "case",
        [
          "any",
          ["==", ["get", "user_active"], "true"],
          ["==", ["get", "active"], "true"],
        ],
        orange,
        ["get", "user_color"],
      ],
      "line-dasharray": [
        "case",
        ["==", ["get", "active"], "true"],
        [0.2, 2],
        [2, 0],
      ],
      "line-width": 2,
    },
  },
  // New points
  // These will be used when adding a new point (which hasn't been saved yet)
  {
    id: "gl-draw-point-outer",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!has", "user_flat_icon"],
    ],
    paint: {
      "circle-radius": 8,
      "circle-color": white,
    },
  },
  {
    id: "gl-draw-point-inner",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!has", "user_flat_icon"],
    ],
    paint: {
      "circle-radius": 6,
      "circle-color": orange,
    },
  },
  // Emoji Markers
  {
    id: "image-markers",
    type: "symbol",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
    layout: {
      "icon-image": ["get", "user_flat_icon"],
      "icon-size": [
        "case",
        [
          "any",
          ["==", ["get", "user_active"], "true"],
          ["==", ["get", "active"], "true"],
        ],
        0.66,
        0.55,
      ],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      "icon-anchor": "center",
      "icon-offset": [0, 3],
    },
  },
  // Vertex
  //   Visible when editing polygons and lines
  //   Similar behaviour to Points
  //   Active state defines size
  {
    id: "gl-draw-vertex-outer",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "vertex"],
      ["!=", "mode", "simple_select"],
    ],
    paint: {
      "circle-radius": [
        "case",
        [
          "any",
          ["==", ["get", "user_active"], "true"],
          ["==", ["get", "active"], "true"],
        ],
        7,
        5,
      ],
      "circle-color": white,
    },
  },
  {
    id: "gl-draw-vertex-inner",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "vertex"],
      ["!=", "mode", "simple_select"],
    ],
    paint: {
      "circle-radius": [
        "case",
        [
          "any",
          ["==", ["get", "user_active"], "true"],
          ["==", ["get", "active"], "true"],
        ],
        5,
        3,
      ],
      "circle-color": orange,
    },
  },
  // Midpoint
  //   Visible when editing polygons and lines
  //   Tapping or dragging them adds a new vertex to the feature
  {
    id: "gl-draw-midpoint",
    type: "circle",
    filter: ["all", ["==", "meta", "midpoint"]],
    paint: {
      "circle-radius": 3,
      "circle-color": orange,
    },
  },
];
