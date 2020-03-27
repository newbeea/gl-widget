import { Texture } from "./Texture";
declare class TextureManager {
    unit: number;
    gl: WebGLRenderingContext;
    textureCache: WeakMap<any, any>;
    constructor(gl: WebGLRenderingContext);
    createTexture(texture: Texture, width: any, height: any): void;
    setTexture2D(texture: Texture, options: any): void;
    setTextureCube(texture: Texture, options: any): void;
}
export { TextureManager };
