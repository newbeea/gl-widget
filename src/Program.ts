import { Shader } from './Shader'
export interface ShaderObject {
  vertexShader: string,
  fragmentShader: string
}
class Program {
  program: WebGLProgram
  constructor(gl: WebGLRenderingContext) {
    let program: WebGLProgram = gl.createProgram();
    let V =
      `
        void main () {
          gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
          gl_PointSize = 10.0;
        }

      `

    let F =
      `
        void main () {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `
    let vertexShader: WebGLShader = new Shader(gl, gl.VERTEX_SHADER, V)
    let fragmentShader: WebGLShader = new Shader(gl, gl.FRAGMENT_SHADER, F)
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