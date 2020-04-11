import { Program, ShaderObject } from "./Program"

class ProgramManager {
  programCache: Map<string, Program>
  constructor () {
    this.programCache = new Map()
  }
  getProgram (gl, shader: ShaderObject): Program {
    let key = this.getProgramCacheKey(shader)
    let program = this.programCache.get(key)
    if (program) {

    } else {
      console.log(shader)
      console.log(2)
      program  = new Program(gl, shader)
      this.programCache.set(key, program)
    }
    return program
  }
	getProgramCacheKey( shader ) {
		let array = [];
		array.push( shader.fragmentShader );
		array.push( shader.vertexShader );
  	return array.join();

	}
}
export {
  ProgramManager
}