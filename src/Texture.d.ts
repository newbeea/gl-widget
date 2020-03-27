interface State {
    needsUpdate: boolean;
    version: number;
}
declare class Texture {
    glTexture: WebGLTexture;
    image: any;
    images: Array<any>;
    format: any;
    type: any;
    version: number;
    needsUpdate: boolean;
    imageCount: number;
    imageLoadedCount: number;
    state: State;
    constructor(imageSrc?: any, format?: number, type?: number);
    loadedCallback(): void;
    clone(): Texture;
    copy(source: any): this;
}
export { Texture };
