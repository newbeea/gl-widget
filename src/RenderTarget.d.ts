import { Texture } from "./Texture";
import { TextureManager } from "./TextureManager";
declare class RenderTarget {
    width: number;
    height: number;
    texture: Texture;
    frameBuffer: any;
    textureBuffer: any;
    gl: WebGLRenderingContext;
    textureManager: TextureManager;
    constructor(gl: WebGLRenderingContext, width: any, height: any, options?: {});
    setupDepthTexture(framebuffer: any, renderTarget: any): void;
    clone(): RenderTarget;
    copy(source: any): this;
}
export { RenderTarget };
