declare class WebGL {
    static webGL: WebGL;
    gl: WebGLRenderingContext;
    emptyTextures: any;
    constructor(gl: WebGLRenderingContext);
    getEmptyTexture(type: any): any;
    createTexture(type: any, target: any, count: any): WebGLTexture;
    static getInstance(gl: any): WebGL;
}
export default WebGL;
