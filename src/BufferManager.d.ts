import { BufferGeometry } from "./BufferGeometry";
import { Attribute } from "./Attribute";
declare class BufferManager {
    buffers: WeakMap<Attribute, WebGLBuffer>;
    constructor();
    initBuffer(gl: WebGLRenderingContext, program: WebGLProgram, geometry: BufferGeometry): -1 | {
        hasIndex: boolean;
        count: number;
    };
    bindBuffer(gl: WebGLRenderingContext, program: WebGLProgram, geometry: BufferGeometry): void;
}
export { BufferManager };
