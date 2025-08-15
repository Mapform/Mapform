import Phenomenon from "phenomenon";
import {
  GLSLX_NAME_PHI,
  GLSLX_NAME_THETA,
  GLSLX_NAME_DOTS,
  GLSLX_NAME_DOTS_BRIGHTNESS,
  GLSLX_NAME_BASE_COLOR,
  GLSLX_NAME_MARKER_COLOR,
  GLSLX_NAME_GLOW_COLOR,
  GLSLX_NAME_DIFFUSE,
  GLSLX_NAME_DARK,
  GLSLX_NAME_OFFSET,
  GLSLX_NAME_SCALE,
  GLSLX_NAME_OPACITY,
  GLSLX_NAME_MAP_BASE_BRIGHTNESS,
  GLSLX_NAME_U_TEXTURE,
  GLSLX_SOURCE_MAIN,
  GLSLX_NAME_U_RESOLUTION,
  GLSLX_NAME_MARKERS,
  GLSLX_NAME_MARKERS_NUM,
} from "./shader";

const OPT_PHI = "phi";
const OPT_THETA = "theta";
const OPT_DOTS = "mapSamples";
const OPT_MAP_BRIGHTNESS = "mapBrightness";
const OPT_BASE_COLOR = "baseColor";
const OPT_MARKER_COLOR = "markerColor";
const OPT_GLOW_COLOR = "glowColor";
const OPT_MARKERS = "markers";
const OPT_DIFFUSE = "diffuse";
const OPT_DPR = "devicePixelRatio";
const OPT_DARK = "dark";
const OPT_OFFSET = "offset";
const OPT_SCALE = "scale";
const OPT_OPACITY = "opacity";
const OPT_MAP_BASE_BRIGHTNESS = "mapBaseBrightness";

const OPT_MAPPING = {
  [OPT_PHI]: GLSLX_NAME_PHI,
  [OPT_THETA]: GLSLX_NAME_THETA,
  [OPT_DOTS]: GLSLX_NAME_DOTS,
  [OPT_MAP_BRIGHTNESS]: GLSLX_NAME_DOTS_BRIGHTNESS,
  [OPT_BASE_COLOR]: GLSLX_NAME_BASE_COLOR,
  [OPT_MARKER_COLOR]: GLSLX_NAME_MARKER_COLOR,
  [OPT_GLOW_COLOR]: GLSLX_NAME_GLOW_COLOR,
  [OPT_DIFFUSE]: GLSLX_NAME_DIFFUSE,
  [OPT_DARK]: GLSLX_NAME_DARK,
  [OPT_OFFSET]: GLSLX_NAME_OFFSET,
  [OPT_SCALE]: GLSLX_NAME_SCALE,
  [OPT_OPACITY]: GLSLX_NAME_OPACITY,
  [OPT_MAP_BASE_BRIGHTNESS]: GLSLX_NAME_MAP_BASE_BRIGHTNESS,
};

const { PI, sin, cos } = Math;

const mapMarkers = (markers) => {
  return [].concat(
    ...markers.map((m) => {
      let [a, b] = m.location;
      a = (a * PI) / 180;
      b = (b * PI) / 180 - PI;
      const cx = cos(a);

      // Position and size data
      const posData = [-cx * cos(b), sin(a), cx * sin(b), m.size];

      // Color data (use marker color if provided, otherwise [0,0,0] to indicate default)
      const colorData = m.color ? [...m.color, 1] : [0, 0, 0, 0];

      return [...posData, ...colorData];
    }),
    // Make sure to fill zeros for both position and color data
    [0, 0, 0, 0, 0, 0, 0, 0],
  );
};

export default (canvas, opts) => {
  // Keep a reference to the user's render callback so we can compose animations
  const userOnRender = opts.onRender;

  // Internal animation state for flyTo
  let flyAnim = null;
  let currentPhi = typeof opts.phi === "number" ? opts.phi : 0;
  let currentTheta = typeof opts.theta === "number" ? opts.theta : 0;

  const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

  const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const normalizeAngle = (a) => {
    const twoPi = Math.PI * 2;
    return ((a % twoPi) + twoPi) % twoPi;
  };

  const shortestAngleDelta = (from, to) => {
    const twoPi = Math.PI * 2;
    let delta = normalizeAngle(to) - normalizeAngle(from);
    if (delta > Math.PI) delta -= twoPi;
    if (delta < -Math.PI) delta += twoPi;
    return delta;
  };
  const createUniform = (type, name, fallback) => {
    return {
      type,
      value: typeof opts[name] === "undefined" ? fallback : opts[name],
    };
  };

  // See https://github.com/shuding/cobe/pull/34.
  const contextType = canvas.getContext("webgl2")
    ? "webgl2"
    : canvas.getContext("webgl")
      ? "webgl"
      : "experimental-webgl";

  const p = new Phenomenon({
    canvas,
    contextType,
    context: {
      alpha: true,
      stencil: false,
      antialias: true,
      depth: false,
      preserveDrawingBuffer: false,
      ...opts.context,
    },
    settings: {
      [OPT_DPR]: opts[OPT_DPR] || 1,
      onSetup: (gl) => {
        const RGBFormat = gl.RGB;
        const srcType = gl.UNSIGNED_BYTE;
        const TEXTURE_2D = gl.TEXTURE_2D;

        const texture = gl.createTexture();
        gl.bindTexture(TEXTURE_2D, texture);
        gl.texImage2D(
          TEXTURE_2D,
          0,
          RGBFormat,
          1,
          1,
          0,
          RGBFormat,
          srcType,
          new Uint8Array([0, 0, 0, 0]),
        );

        const image = new Image();
        image.onload = () => {
          gl.bindTexture(TEXTURE_2D, texture);
          gl.texImage2D(TEXTURE_2D, 0, RGBFormat, RGBFormat, srcType, image);

          gl.generateMipmap(TEXTURE_2D);

          const program = gl.getParameter(gl.CURRENT_PROGRAM);
          const textureLocation = gl.getUniformLocation(
            program,
            GLSLX_NAME_U_TEXTURE,
          );
          gl.texParameteri(
            TEXTURE_2D,
            gl.TEXTURE_MIN_FILTER,
            gl.LINEAR_MIPMAP_LINEAR,
          );
          gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.uniform1i(textureLocation, 0);
        };
        image.src = __TEXTURE__;
      },
    },
  });

  p.add("", {
    vertex: `attribute vec3 aPosition;uniform mat4 uProjectionMatrix;uniform mat4 uModelMatrix;uniform mat4 uViewMatrix;void main(){gl_Position=uProjectionMatrix*uModelMatrix*uViewMatrix*vec4(aPosition,1.);}`,
    fragment: GLSLX_SOURCE_MAIN,
    uniforms: {
      [GLSLX_NAME_U_RESOLUTION]: {
        type: "vec2",
        value: [opts.width, opts.height],
      },
      [GLSLX_NAME_PHI]: createUniform("float", OPT_PHI),
      [GLSLX_NAME_THETA]: createUniform("float", OPT_THETA),
      [GLSLX_NAME_DOTS]: createUniform("float", OPT_DOTS),
      [GLSLX_NAME_DOTS_BRIGHTNESS]: createUniform("float", OPT_MAP_BRIGHTNESS),
      [GLSLX_NAME_MAP_BASE_BRIGHTNESS]: createUniform(
        "float",
        OPT_MAP_BASE_BRIGHTNESS,
      ),
      [GLSLX_NAME_BASE_COLOR]: createUniform("vec3", OPT_BASE_COLOR),
      [GLSLX_NAME_MARKER_COLOR]: createUniform("vec3", OPT_MARKER_COLOR),
      [GLSLX_NAME_DIFFUSE]: createUniform("float", OPT_DIFFUSE),
      [GLSLX_NAME_GLOW_COLOR]: createUniform("vec3", OPT_GLOW_COLOR),
      [GLSLX_NAME_DARK]: createUniform("float", OPT_DARK),
      [GLSLX_NAME_MARKERS]: {
        type: "vec4",
        value: mapMarkers(opts[OPT_MARKERS]),
      },
      [GLSLX_NAME_MARKERS_NUM]: {
        type: "float",
        value: opts[OPT_MARKERS].length,
      },
      [GLSLX_NAME_OFFSET]: createUniform("vec2", OPT_OFFSET, [0, 0]),
      [GLSLX_NAME_SCALE]: createUniform("float", OPT_SCALE, 1),
      [GLSLX_NAME_OPACITY]: createUniform("float", OPT_OPACITY, 1),
    },
    mode: 4,
    geometry: {
      vertices: [
        { x: -100, y: 100, z: 0 },
        { x: -100, y: -100, z: 0 },
        { x: 100, y: 100, z: 0 },
        { x: 100, y: -100, z: 0 },
        { x: -100, y: -100, z: 0 },
        { x: 100, y: 100, z: 0 },
      ],
    },
    onRender: ({ uniforms }) => {
      let state = {};
      if (userOnRender) {
        state = userOnRender(state) || state;
        for (const k in OPT_MAPPING) {
          if (state[k] !== undefined) {
            uniforms[OPT_MAPPING[k]].value = state[k];
          }
        }
        if (state[OPT_MARKERS] !== undefined) {
          uniforms[GLSLX_NAME_MARKERS].value = mapMarkers(state[OPT_MARKERS]);
          uniforms[GLSLX_NAME_MARKERS_NUM].value = state[OPT_MARKERS].length;
        }
        if (state.width && state.height) {
          uniforms[GLSLX_NAME_U_RESOLUTION].value = [state.width, state.height];
        }
      }

      // Snapshot current values from uniforms after user updates
      if (uniforms[GLSLX_NAME_PHI] && typeof uniforms[GLSLX_NAME_PHI].value === "number") {
        currentPhi = uniforms[GLSLX_NAME_PHI].value;
      }
      if (
        uniforms[GLSLX_NAME_THETA] &&
        typeof uniforms[GLSLX_NAME_THETA].value === "number"
      ) {
        currentTheta = uniforms[GLSLX_NAME_THETA].value;
      }

      // Apply flyTo animation after user state so animation always takes precedence
      if (flyAnim) {
        const t = clamp01((now() - flyAnim.startTime) / flyAnim.duration);
        const e = (flyAnim.easing || easeInOutCubic)(t);

        const phi = flyAnim.startPhi + shortestAngleDelta(flyAnim.startPhi, flyAnim.endPhi) * e;
        const theta = flyAnim.startTheta + (flyAnim.endTheta - flyAnim.startTheta) * e;

        uniforms[GLSLX_NAME_PHI].value = phi;
        uniforms[GLSLX_NAME_THETA].value = theta;
        currentPhi = phi;
        currentTheta = theta;

        if (t >= 1) {
          flyAnim = null;
        }
      }
    },
  });

  // Public method to animate globe rotation to a given latitude/longitude
  // lat, lon in degrees
  p.flyTo = (lat, lon, options = {}) => {
    const duration = typeof options.duration === "number" ? options.duration : 1000;
    const easing = options.easing || easeInOutCubic;

    // Convert to radians
    const latRad = (lat * PI) / 180;
    const lonRad = (lon * PI) / 180;

    // Map lat/lon to phi/theta that center the coordinate
    const targetPhi = normalizeAngle(PI - lonRad);
    const targetTheta = PI / 2 - latRad;

    // Start from the last known values
    const startPhi = currentPhi || 0;
    const startTheta = currentTheta || 0;

    flyAnim = {
      startPhi,
      startTheta,
      endPhi: targetPhi,
      endTheta: targetTheta,
      startTime: now(),
      duration,
      easing,
    };
  };

  return p;
};
