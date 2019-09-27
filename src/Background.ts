import { Attribute } from "./Attribute";
import { Geometry } from "./Geometry";
import { ShaderObject, Program } from "./Program";
import { BackgroundGeometry } from "./BackgroundGeometry";
import { BufferManager } from "./BufferManager";
class Background {
  program: WebGLProgram
  constructor(gl: WebGLRenderingContext, width: number, height: number, fragmentShader: string) {
    let shader: ShaderObject = {
      
      vertexShader: `
        attribute vec4 a_Position;
        void main () {
          gl_Position = a_Position;
        }

      `,
      fragmentShader: fragmentShader
    }
    let program: Program = new Program(gl, shader)
    this.program = program.program
    let geometry = new BackgroundGeometry()
    
    //setup buffer and attribute
    let bufferManager = new BufferManager()
    bufferManager.initBuffer(gl, this.program, geometry)

    
    //setup uniform
    var r = gl.getUniformLocation(this.program, 'resolution')
    gl.uniform2f(r, width, height);
  }
  getProgram(): WebGLProgram {
    return this.program
  }
}
export {
  Background
} 