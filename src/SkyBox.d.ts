import { Background } from "./Background";
import { Geometry } from "./Geometry";
import { BufferGeometry } from "./BufferGeometry";
declare class SkyBox extends Background {
    gl: WebGLRenderingContext;
    vertexNum: number;
    fragmentShader: string;
    constructor(material?: {}, geometry?: Geometry | BufferGeometry);
}
export { SkyBox };
