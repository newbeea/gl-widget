import { Attribute } from "./Attribute";
import { Geometry } from "./Geometry";
import { ShaderObject, Program } from "./Program";
import { BackgroundGeometry } from "./BackgroundGeometry";
import { BufferManager } from "./BufferManager";
class Background {
  program: WebGLProgram
  gl: WebGLRenderingContext
  fragmentShader: string
  constructor(fragmentShader: string = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}') {
    this.fragmentShader = fragmentShader
  }
  setup(gl: WebGLRenderingContext, width: number, height: number) {
    this.gl = gl
    let shader: ShaderObject = {
      
      vertexShader: `
        attribute vec4 a_Position;
        void main () {
          gl_Position = a_Position;
        }

      `,
      fragmentShader: this.fragmentShader
    }
    let program: Program = new Program(gl, shader)
    this.program = program.program
    let geometry = new BackgroundGeometry()
    
    //setup buffer and attribute
    let bufferManager = new BufferManager()
    bufferManager.initBuffer(gl, this.program, geometry)
    this.setSize(width, height)
  }
  setSize(width: number, height: number) {
    var r = this.gl.getUniformLocation(this.program, 'resolution')
    this.gl.uniform2f(r, width, height);
  }
  getProgram(): WebGLProgram {
    return this.program
  }
}
export {
  Background
} 