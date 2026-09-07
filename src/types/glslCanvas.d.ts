declare module "glslCanvas" {
  const GlslCanvas: new (canvas: HTMLCanvasElement) => {
    destroy: () => void;
    height: number;
    load: (fragmentSource?: string, vertexSource?: string) => void;
    resize: () => boolean;
    setUniform: (name: string, ...values: (number | string)[]) => void;
    textures: Record<string, { height?: number; width?: number }>;
    width: number;
  };

  export default GlslCanvas;
}
