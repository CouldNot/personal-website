"use client";

import { useEffect, useRef } from "react";

type RippleInstance = {
  destroy: () => void;
  _glsl?: {
    height: number;
    textures: Record<string, unknown>;
    width: number;
    resize: () => boolean;
  };
};

const artwork = "/media/yoshida_hiroshi-paper-q98.webp";
const waterMask = "/media/mask.png";

export default function WaterRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let ripple: RippleInstance | undefined;
    let resolutionFrame: number | undefined;

    const restoreDeviceResolution = () => {
      if (disposed || !ripple?._glsl) return;

      // webgl-water-ripple assigns canvas.width/height to the image's native
      // size after it loads. That bypasses glslCanvas's normal DPR-aware resize,
      // leaving a full-screen canvas soft on high-density displays.
      if (!ripple._glsl.textures.g_Texture0) {
        resolutionFrame = requestAnimationFrame(restoreDeviceResolution);
        return;
      }

      ripple._glsl.width = -1;
      ripple._glsl.height = -1;
      ripple._glsl.resize();
    };

    void import("webgl-water-ripple")
      .then(({ WaterRipple }) => {
        if (disposed) return;

        ripple = new WaterRipple({
          canvas,
          imageURL: artwork,
          maskURL: waterMask,
          animationSpeed: 0.2,
          scrollSpeed: 0,
          direction: 0,
          ratio: 1,
          scale: 5,
          strength: 0.09,
        });

        resolutionFrame = requestAnimationFrame(restoreDeviceResolution);
      })
      .catch((error: unknown) => {
        console.error("Unable to start the water-ripple animation.", error);
      });

    return () => {
      disposed = true;
      if (resolutionFrame !== undefined) cancelAnimationFrame(resolutionFrame);
      ripple?.destroy();
    };
  }, []);

  return (
    <div className="water-stage">
      <canvas ref={canvasRef} className="water-ripple" aria-label="Animated water scene" />
    </div>
  );
}
