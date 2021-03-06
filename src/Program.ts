import { Shader } from './Shader'
import { UniformManager } from './UniformManager'
import { BufferManager } from './BufferManager'
export interface ShaderObject {
  vertexShader: string,
  fragmentShader: string
}
class Program {
  program: WebGLProgram
  uniformManager: UniformManager
  // bufferManager: BufferManager
  constructor(gl: WebGLRenderingContext, shader: ShaderObject) {
    this.program = gl.createProgram();
    
    let vertexShader: WebGLShader = new Shader(gl, gl.VERTEX_SHADER, shader.vertexShader)
    let fragmentShader: WebGLShader = new Shader(gl, gl.FRAGMENT_SHADER, shader.fragmentShader)

    gl.attachShader(this.program, vertexShader)
    gl.attachShader(this.program, fragmentShader)

    gl.linkProgram(this.program)

    let programLog = gl.getProgramInfoLog(this.program).trim()

    if (gl.getProgramParameter(this.program, gl.LINK_STATUS) === false) {
      console.error('shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter(this.program, gl.VALIDATE_STATUS), 'gl.getProgramInfoLog', programLog);
    } else if (programLog !== '') {
      console.warn('gl.getProgramInfoLog()', programLog)
    }
    gl.useProgram(this.program)
    gl.deleteShader( vertexShader );
    gl.deleteShader( fragmentShader );
    
    this.uniformManager = new UniformManager(gl, this.program)
    // this.bufferManager = new BufferManager()
  }

}
export {
  Program
} 