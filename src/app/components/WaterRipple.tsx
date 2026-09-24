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
const waterMask = "/media/image_mask.png";
const waterNormal = "/media/water-normal.png";
const normalWater = {
  animationSpeed: 0.25,
  direction: (120 * Math.PI) / 180,
  ratio: 1,
  scale: 5,
  scrollSpeed: 0.2,
  strength: 0.1,
};

const projects = [
  {
    name: "trackside",
    href: "https://tracksideracing.app",
    description: "a social motorsports app for live races",
  },
  {
    name: "brawldle.io (now brawldle.gg)",
    href: "https://brawldle.gg",
    description: (
      <>
        a daily puzzle game for brawl stars :)
        <br />
        acquired in 2026
      </>
    ),
  },
  {
    name: "beacon",
    href: "https://github.com/CouldNot/beacon",
    description: "a multi-protocol proxy client for macOS",
  },
] as const;

// Previous iterations of the site, oldest first.
const versions = [
  // Placeholder until v1 is hosted.
  { name: "v1", href: "https://v1.daled.ai" },
] as const;

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
    // fbm rarely leaves 0.12..0.78, so normalize to that range. The front then
    // sweeps from before the lowest grain to past the highest, and u_progress
    // 0 and 1 are exactly untouched and fully dissolved.
    const float GRAIN_MIN = 0.12;
    const float GRAIN_MAX = 0.78;
    const float EDGE = 0.2;
    float grain = clamp((fbm(v_texcoord * vec2(8.0, 6.0)) - GRAIN_MIN) / (GRAIN_MAX - GRAIN_MIN), 0.0, 1.0);
    float dissolved = smoothstep(0.0, EDGE, u_progress * (1.0 + EDGE) - grain);
    vec3 pageColor = vec3(0.9529411765, 0.9450980392, 0.9098039216);
    gl_FragColor = vec4(mix(color.rgb, pageColor, dissolved), 1.0);
  }
`;

export default function WaterRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const togglePaintingRef = useRef<() => void>(() => {});
  const toggleStillnessRef = useRef<() => void>(() => {});
  const timeMachineRef = useRef<HTMLElement>(null);
  const timeMachineToggleRef = useRef<HTMLButtonElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [timeMachineOpen, setTimeMachineOpen] = useState(false);
  const [waterStill, setWaterStill] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mobileLayout = window.matchMedia("(max-width: 1100px), (max-height: 560px)");
    let isMobile = mobileLayout.matches;
    const updateMobileLayout = (event: MediaQueryListEvent) => {
      isMobile = event.matches;
    };
    mobileLayout.addEventListener("change", updateMobileLayout);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = reducedMotion.matches;
    const updateReducedMotion = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      motionIsTransitioning = false;
      motionFactor = prefersReducedMotion || isWaterStill ? 0 : 1;
      isTransitioning = false;
      dissolveProgress = dissolveTo;
    };
    reducedMotion.addEventListener("change", updateReducedMotion);

    let disposed = false;
    let glsl: GlslCanvasInstance | undefined;
    let renderFrame: number | undefined;
    let readinessFrame: number | undefined;
    let isReady = false;
    let isTransitioning = false;
    let isWaterStill = false;
    let motionFactor = prefersReducedMotion ? 0 : 1;
    let motionFactorFrom = 1;
    let motionFactorTo = 1;
    let motionTransitionStartedAt = 0;
    let motionTransitionDuration = 0;
    let motionIsTransitioning = false;
    let ripplePhase = 0;
    let scrollPhase = 0;
    let dissolveProgress = 0;
    let dissolveFrom = 0;
    let dissolveTo = 0;
    let transitionStartedAt = 0;
    let transitionDuration = 0;
    let previousTimestamp: number | undefined;

    const render = (now: number) => {
      if (disposed || !glsl) return;

      if (isTransitioning && !prefersReducedMotion) {
        const linearProgress = Math.min((now - transitionStartedAt) / transitionDuration, 1);
        const easedProgress = 1 - (1 - linearProgress) ** 3;
        dissolveProgress = dissolveFrom + (dissolveTo - dissolveFrom) * easedProgress;

        if (linearProgress === 1) {
          dissolveProgress = dissolveTo;
          isTransitioning = false;
        }
      }

      if (motionIsTransitioning && !prefersReducedMotion) {
        const linearProgress = Math.min((now - motionTransitionStartedAt) / motionTransitionDuration, 1);
        const easedProgress = linearProgress * linearProgress * (3 - 2 * linearProgress);
        motionFactor = motionFactorFrom + (motionFactorTo - motionFactorFrom) * easedProgress;

        if (linearProgress === 1) {
          motionFactor = motionFactorTo;
          motionIsTransitioning = false;
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
      glsl.setUniform("u_progress", isMobile ? 0 : dissolveProgress);
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
      setCanvasReady(true);
      renderFrame = requestAnimationFrame(render);
    };

    // Toggles are never locked: a click mid-transition reverses from the
    // current value, and the duration scales with the distance left to cover.
    togglePaintingRef.current = () => {
      if (isMobile) return;

      dissolveFrom = dissolveProgress;
      dissolveTo = dissolveTo === 1 ? 0 : 1;
      if (prefersReducedMotion || !isReady) {
        dissolveProgress = dissolveTo;
        isTransitioning = false;
        setAboutOpen(dissolveTo === 1);
        return;
      }
      transitionDuration = Math.max(2800 * Math.abs(dissolveTo - dissolveFrom), 1);
      transitionStartedAt = performance.now();
      isTransitioning = true;
      setAboutOpen(dissolveTo === 1);
    };

    toggleStillnessRef.current = () => {
      if (!isReady || prefersReducedMotion) return;

      motionFactorFrom = motionFactor;
      motionFactorTo = isWaterStill ? 1 : 0;
      motionTransitionDuration = Math.max(1600 * Math.abs(motionFactorTo - motionFactorFrom), 1);
      motionTransitionStartedAt = performance.now();
      motionIsTransitioning = true;
      isWaterStill = !isWaterStill;
      setWaterStill(isWaterStill);
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
      mobileLayout.removeEventListener("change", updateMobileLayout);
      reducedMotion.removeEventListener("change", updateReducedMotion);
      togglePaintingRef.current = () => {};
      toggleStillnessRef.current = () => {};
      if (renderFrame !== undefined) cancelAnimationFrame(renderFrame);
      if (readinessFrame !== undefined) cancelAnimationFrame(readinessFrame);
      glsl?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!timeMachineOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!timeMachineRef.current?.contains(event.target as Node)) {
        setTimeMachineOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setTimeMachineOpen(false);
      timeMachineToggleRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [timeMachineOpen]);

  return (
    <main className={`water-stage${aboutOpen && !canvasReady ? " is-fallback-about" : ""}`}>
      <div
        className="artwork-frame"
        role="img"
        aria-label="Harbor painting by Hiroshi Yoshida with animated water"
        aria-hidden={aboutOpen}
      >
        <canvas ref={canvasRef} className="water-ripple" aria-hidden="true" />
      </div>
      <div className={aboutOpen ? "about-panel is-visible" : "about-panel"}>
        <section className="about-fragment about-identity" aria-labelledby="about-title">
          <h2 id="about-title">[about me]</h2>
          <p>
            I&apos;m Dale, a computer science student @{" "}
            <a
              className="text-link"
              href="https://www.usc.edu/"
              target="_blank"
              rel="noreferrer"
            >
              USC
            </a>
            , currently exploring consumer agents (and more...)
          </p>
          <p>
            In my free time, I like to play piano and listen to music.
          </p>
        </section>
        <section className="about-fragment about-projects" aria-labelledby="projects-title">
          <h2 id="projects-title">[selected projects]</h2>
          <ul className="about-list project-list">
            {projects.map((project) => (
              <li key={project.name}>
                <a
                  className="text-link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.name}
                </a>
                <p className="about-entry-detail">{project.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="about-fragment about-experience" aria-labelledby="experience-title">
          <h2 id="experience-title">[experience]</h2>
          <ul className="about-list">
            <li>
              <p>troylabs</p>
              <p className="about-entry-detail">software engineer / 2026-now</p>
            </li>
            <li>
              <p>trackside</p>
              <p className="about-entry-detail">co-founder / 2026—now</p>
            </li>
            <li>
              <p>open source</p>
              <p className="about-entry-detail">contributor / 2022—26</p>
            </li>
          </ul>
        </section>
      </div>
      <div className="painting-text-slot">
        <div className="painting-text-group">
          {/* The name secretly doubles as the time machine. */}
          <nav ref={timeMachineRef} className="time-machine" aria-label="Previous versions">
            <h1 className="site-title">
              <button
                ref={timeMachineToggleRef}
                className="about-toggle"
                type="button"
                aria-expanded={timeMachineOpen}
                aria-controls="time-machine-list"
                onClick={() => setTimeMachineOpen((open) => !open)}
              >
                Dale Dai
              </button>
            </h1>
            <ul id="time-machine-list" className="time-machine-list" hidden={!timeMachineOpen}>
              {versions.map((version) => (
                <li key={version.name}>
                  <a
                    className="text-link"
                    href={version.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {version.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className="about-toggle"
            type="button"
            aria-pressed={aboutOpen}
            onClick={() => togglePaintingRef.current()}
          >
            {aboutOpen ? "[*] about" : "[ ] about"}
          </button>
          <button
            className="about-toggle flow-toggle"
            type="button"
            aria-pressed={!waterStill}
            onClick={() => toggleStillnessRef.current()}
          >
            {waterStill ? "[ ] flow" : "[*] flow"}
          </button>
        </div>
        <div className="painting-text-group painting-text-right">
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
          <a className="text-link" href="mailto:hi@daled.ai">
            hi@daled.ai
          </a>
        </div>
      </div>
    </main>
  );
}
