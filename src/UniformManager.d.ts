import { TextureManager } from "./TextureManager";
declare class UniformManager {
    map: any;
    seq: any[];
    gl: any;
    textureManager: TextureManager;
    constructor(gl: any, program: any);
    addUniform(container: any, uniformObject: any): void;
    parseUniform(activeInfo: any, addr: any, container: any): void;
    updateUniforms(uniforms?: {}): void;
    filterUniforms(ids: any): any[];
}
export { UniformManager };
