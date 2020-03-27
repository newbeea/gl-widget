import { UniformManager } from './UniformManager';
export interface ShaderObject {
    vertexShader: string;
    fragmentShader: string;
}
declare class Program {
    program: WebGLProgram;
    uniformManager: UniformManager;
    constructor(gl: WebGLRenderingContext, shader: ShaderObject);
}
export { Program };
