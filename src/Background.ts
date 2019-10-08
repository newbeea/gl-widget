
import { ShaderObject, Program } from "./Program";
import { BackgroundGeometry } from "./BackgroundGeometry";
import { BufferManager } from "./BufferManager";
import { Geometry } from "./Geometry";
import { RenderedObject } from "./RenderedObject";

class Background extends RenderedObject {
  program: WebGLProgram
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  geometry: Geometry
  constructor(fragmentShader: string = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}') {
    super()
    this.fragmentShader = fragmentShader
  }
  setup(gl: WebGLRenderingContext, bufferManager: BufferManager, width: number, height: number) {
    this.gl = gl
    let shader: ShaderObject = {
      
      vertexShader: `
        attribute vec4 position;
        void main () {
          gl_Position = position;
        }

      `,
      fragmentShader: this.fragmentShader
    }
    let program: Program = new Program(gl, shader)
    this.program = program.program
    this.geometry = new BackgroundGeometry()
    
    //setup buffer and attribute
    // let bufferManager = new BufferManager()
    this.vertexNum = bufferManager.initBuffer(gl, this.program, this.geometry)
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