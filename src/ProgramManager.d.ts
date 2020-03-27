import { Program, ShaderObject } from "./Program";
declare class ProgramManager {
    programCache: Map<string, Program>;
    constructor();
    getProgram(gl: any, shader: ShaderObject): Program;
    getProgramCacheKey(shader: any): string;
}
export { ProgramManager };
