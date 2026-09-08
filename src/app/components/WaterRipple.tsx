"use client";

import { useEffect, useRef, useState } from "react";

type TextureState = {
  height?: number;
  width?: number;
};

type GlslCanvasInstance = {
  destroy: () => void;
  height: number;
  load: (fragmentSource?: string, vertexSource?: string) => void;
  resize: () => boolean;
  setUniform: (name: string, ...values: (number | string)[]) => void;
  textures: Record<string, TextureState>;
  width: number;
};

type GlslCanvasConstructor = new (canvas: HTMLCanvasElement) => GlslCanvasInstance;

const artwork = "/media/yoshida_hiroshi-paper-q98.webp";
const waterMask = "/media/mask.png";
const waterNormal = "/media/water-normal.png";
const normalWater = {
  animationSpeed: 0.2,
  direction: (120 * Math.PI) / 180,
  ratio: 1,
  scale: 6,
  scrollSpeed: 0.25,
  strength: 0.1,
};

const vertexShader = `
  uniform vec2 g_Texture0Resolution;

  attribute vec2 a_position;
  attribute vec2 a_texcoord;

  varying vec2 v_texcoord;
  varying vec4 v_ripple_coord;

  uniform float g_Time;
  uniform float g_RipplePhase;
  uniform float g_Scale;
  uniform float g_ScrollSpeed;
  uniform float g_Direction;
  uniform float g_Ratio;

  vec2 rotateVector(vec2 value, float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return vec2(cosine * value.x - sine * value.y, sine * value.x + cosine * value.y);
  }

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texcoord = a_texcoord;

    vec2 secondaryCoordinates = a_texcoord * 1.333;
    vec2 scroll = rotateVector(vec2(0.0, 1.0), g_Direction)
      * g_ScrollSpeed * g_ScrollSpeed * g_Time;

    v_ripple_coord.xy = a_texcoord
      + g_RipplePhase + scroll;
    v_ripple_coord.zw = secondaryCoordinates
      - g_RipplePhase + scroll;
    v_ripple_coord *= g_Scale;

    float textureRatio = g_Texture0Resolution.x / g_Texture0Resolution.y;
    v_ripple_coord.xz *= textureRatio;
    v_ripple_coord.yw *= g_Ratio;
  }
`;

// The original water effect and the dissolve share one shader program. The
// program never changes after load; the toggle only changes u_progress.
const fragmentShader = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform sampler2D g_Texture0;
  uniform sampler2D g_Texture1;
  uniform sampler2D g_Texture2;
  uniform float g_Strength;
  uniform float u_progress;

  varying vec2 v_texcoord;
  varying vec4 v_ripple_coord;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x),
      local.y
    );
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int index = 0; index < 4; index++) {
      value += amplitude * noise(point);
      point *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 textureCoordinate = v_texcoord;
    float mask = texture2D(g_Texture1, textureCoordinate).r;
    vec4 rippleCoordinates = fract(v_ripple_coord);
    vec3 normal1 = texture2D(g_Texture2, rippleCoordinates.xy).xyz * 2.0 - 1.0;
    vec3 normal2 = texture2D(g_Texture2, rippleCoordinates.zw).xyz * 2.0 - 1.0;
    vec3 normal = normalize(vec3(normal1.xy + normal2.xy, normal1.z));
    textureCoordinate += normal.xy * g_Strength * g_Strength * mask;

    vec4 color = texture2D(g_Texture0, textureCoordinate);
    float grain = fbm(v_texcoord * vec2(8.0, 6.0));
    float dissolved = smoothstep(0.0, 0.13, u_progress * 1.2 - grain + 0.02);
    vec3 pageColor = vec3(0.9529411765, 0.9450980392, 0.9098039216);
    gl_FragColor = vec4(mix(color.rgb, pageColor, dissolved), 1.0);
  }
`;

export default function WaterRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const togglePaintingRef = useRef<() => void>(() => {});
  const toggleStillnessRef = useRef<() => void>(() => {});
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutBusy, setAboutBusy] = useState(false);
  const [waterStill, setWaterStill] = useState(false);
  const [stillnessBusy, setStillnessBusy] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let glsl: GlslCanvasInstance | undefined;
    let renderFrame: number | undefined;
    let readinessFrame: number | undefined;
    let isReady = false;
    let isTransitioning = false;
    let isDissolved = false;
    let isWaterStill = false;
    let motionFactor = 1;
    let motionFactorFrom = 1;
    let motionFactorTo = 1;
    let motionTransitionStartedAt = 0;
    let motionIsTransitioning = false;
    let ripplePhase = 0;
    let scrollPhase = 0;
    let dissolveProgress = 0;
    let dissolveFrom = 0;
    let dissolveTo = 0;
    let transitionStartedAt = 0;
    let previousTimestamp: number | undefined;

    const render = (now: number) => {
      if (disposed || !glsl) return;

      if (isTransitioning) {
        const linearProgress = Math.min((now - transitionStartedAt) / 2000, 1);
        const easedProgress = 1 - (1 - linearProgress) ** 3;
        dissolveProgress = dissolveFrom + (dissolveTo - dissolveFrom) * easedProgress;

        if (linearProgress === 1) {
          dissolveProgress = dissolveTo;
          isDissolved = dissolveTo === 1;
          isTransitioning = false;
          setAboutBusy(false);
        }
      }

      if (motionIsTransitioning) {
        const linearProgress = Math.min((now - motionTransitionStartedAt) / 1600, 1);
        const easedProgress = linearProgress * linearProgress * (3 - 2 * linearProgress);
        motionFactor = motionFactorFrom + (motionFactorTo - motionFactorFrom) * easedProgress;

        if (linearProgress === 1) {
          motionFactor = motionFactorTo;
          motionIsTransitioning = false;
          setStillnessBusy(false);
        }
      }

      if (previousTimestamp !== undefined) {
        const elapsed = Math.min(now - previousTimestamp, 50);
        const motion = motionFactor * motionFactor;
        // Separate phases let speed change smoothly without a visual rewind.
        ripplePhase += elapsed * 0.0003 * normalWater.animationSpeed ** 2 * motion;
        scrollPhase += elapsed * 0.0003 * motion;
      }
      previousTimestamp = now;

      glsl.setUniform("g_Time", scrollPhase);
      glsl.setUniform("g_RipplePhase", ripplePhase);
      glsl.setUniform("u_progress", dissolveProgress);
      glsl.setUniform("g_Strength", normalWater.strength * motionFactor);
      renderFrame = requestAnimationFrame(render);
    };

    const waitForTextures = () => {
      if (disposed || !glsl) return;

      const texturesReady = ["g_Texture0", "g_Texture1", "g_Texture2"].every(
        (name) => (glsl?.textures[name]?.width ?? 0) > 1,
      );

      if (!texturesReady) {
        readinessFrame = requestAnimationFrame(waitForTextures);
        return;
      }

      glsl.width = -1;
      glsl.height = -1;
      glsl.resize();
      isReady = true;
      canvas.classList.add("is-ready");
      renderFrame = requestAnimationFrame(render);
    };

    togglePaintingRef.current = () => {
      if (!isReady || isTransitioning) return;

      dissolveFrom = dissolveProgress;
      dissolveTo = isDissolved ? 0 : 1;
      transitionStartedAt = performance.now();
      isTransitioning = true;
      setAboutOpen(dissolveTo === 1);
      setAboutBusy(true);
    };

    toggleStillnessRef.current = () => {
      if (!isReady || motionIsTransitioning) return;

      motionFactorFrom = motionFactor;
      motionFactorTo = isWaterStill ? 1 : 0;
      motionTransitionStartedAt = performance.now();
      motionIsTransitioning = true;
      isWaterStill = !isWaterStill;
      setWaterStill(isWaterStill);
      setStillnessBusy(true);
    };

    void import("glslCanvas")
      .then(({ default: GlslCanvas }: { default: GlslCanvasConstructor }) => {
        if (disposed) return;

        glsl = new GlslCanvas(canvas);
        glsl.load(fragmentShader, vertexShader);
        glsl.setUniform("g_Texture0", artwork);
        glsl.setUniform("g_Texture1", waterMask);
        glsl.setUniform("g_Texture2", waterNormal);
        glsl.setUniform("g_ScrollSpeed", normalWater.scrollSpeed);
        glsl.setUniform("g_Direction", normalWater.direction);
        glsl.setUniform("g_Ratio", normalWater.ratio);
        glsl.setUniform("g_Scale", normalWater.scale);
        glsl.setUniform("g_Strength", normalWater.strength);
        glsl.setUniform("g_Time", 0);
        glsl.setUniform("g_RipplePhase", 0);
        glsl.setUniform("u_progress", 0);
        readinessFrame = requestAnimationFrame(waitForTextures);
      })
      .catch((error: unknown) => {
        console.error("Unable to start the water-ripple animation.", error);
      });

    return () => {
      disposed = true;
      togglePaintingRef.current = () => {};
      toggleStillnessRef.current = () => {};
      if (renderFrame !== undefined) cancelAnimationFrame(renderFrame);
      if (readinessFrame !== undefined) cancelAnimationFrame(readinessFrame);
      glsl?.destroy();
    };
  }, []);

  return (
    <div className="water-stage">
      <canvas ref={canvasRef} className="water-ripple" aria-label="Animated water scene" />
      <div
        className={aboutOpen ? "about-panel is-visible" : "about-panel"}
        inert={!aboutOpen}
      >
        <p>about me</p>
        <p>
          cs @{" "}
          <a
            className="text-link"
            href="https://www.usc.edu/"
            target="_blank"
            rel="noreferrer"
          >
            usc
          </a>
        </p>
      </div>
      <div className="painting-text-slot">
        <p className="painting-text-group">
          <span>dale dai</span>
          <button
            className="about-toggle"
            type="button"
            aria-pressed={aboutOpen}
            disabled={aboutBusy}
            onClick={() => togglePaintingRef.current()}
          >
            {aboutOpen ? "[*] about" : "[ ] about"}
          </button>
          <button
            className="about-toggle"
            type="button"
            aria-pressed={!waterStill}
            disabled={stillnessBusy}
            onClick={() => toggleStillnessRef.current()}
          >
            {waterStill ? "[ ] go with the flow" : "[*] go with the flow"}
          </button>
        </p>
        <p className="painting-text-group painting-text-right">
          <a
            className="text-link"
            href="https://linkedin.com/in/dale-dai"
            target="_blank"
            rel="noreferrer"
          >
            linkedin
          </a>
          <a
            className="text-link"
            href="https://github.com/CouldNot"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
          <a className="text-link" href="#cv" title="CV coming soon">
            cv
          </a>
          <span>hi@daled.ai</span>
        </p>
      </div>
    </div>
  );
}
