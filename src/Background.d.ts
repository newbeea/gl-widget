import { BufferGeometry } from "./BufferGeometry";
import { RenderableElement } from "./RenderableElement";
import { Geometry } from "./Geometry";
declare class Background extends RenderableElement {
    gl: WebGLRenderingContext;
    vertexNum: number;
    fragmentShader: string;
    constructor(material?: {}, geometry?: Geometry | BufferGeometry);
}
export { Background };
