export interface rendererOptions {
    canvas?: HTMLCanvasElement;
    context?: CanvasRenderingContext2D | WebGLRenderingContext;
}
export interface contextAttributes {
    alpha?: boolean;
    depth?: boolean;
    stencil?: boolean;
    antialias?: boolean;
    premultipliedAlpha?: boolean;
    preserveDrawingBuffer?: boolean;
}
declare class Renderer {
    canvas: HTMLCanvasElement;
    context: any;
    constructor(options?: rendererOptions, attributes?: contextAttributes);
    render(): void;
}
export { Renderer };
