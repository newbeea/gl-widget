declare class Extensions {
    extensions: object;
    gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext);
    get(name: any): object;
}
export { Extensions };
