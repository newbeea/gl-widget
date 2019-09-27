import { Shader } from './Shader'
export interface ShaderObject {
  vertexShader: string,
  fragmentShader: string
}
class Program {
  program: WebGLProgram
  constructor(gl: WebGLRenderingContext, shader: ShaderObject) {
    let program: WebGLProgram = gl.createProgram();
    let vertexShader: WebGLShader = new Shader(gl, gl.VERTEX_SHADER, shader.vertexShader)
    let fragmentShader: WebGLShader = new Shader(gl, gl.FRAGMENT_SHADER, shader.fragmentShader)
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)

    let programLog = gl.getProgramInfoLog(program).trim()

    if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {

      console.error('THREE.WebGLProgram: shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS), 'gl.getProgramInfoLog', programLog);

    } else if (programLog !== '') {

      console.warn('THREE.WebGLProgram: gl.getProgramInfoLog()', programLog)

    }
    gl.useProgram(program)
    return this
  }
}
export {
  Program
} 