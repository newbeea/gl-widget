
import { ShaderObject, Program } from "./Program";
import { BufferManager } from "./BufferManager";
import { Geometry } from "./Geometry";
import { Object3D } from "./Object3D";
import { Matrix3 } from "./math/Matrix3";

class RenderableElement extends Object3D {
  program: WebGLProgram
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  vertexShader: string
  geometry: Geometry
  constructor(material?: any, geometry?: Geometry) {
    super()
    this.vertexShader = `
        attribute vec4 position;
        void main () {
          gl_Position = position;
        }
      ` 
    if (material.fragmentShader) {
      this.fragmentShader = material.fragmentShader
    }
    if (material.vertexShader) {
      this.vertexShader = material.vertexShader
    }
    this.geometry = geometry
  }
  setup(gl: WebGLRenderingContext, bufferManager: BufferManager, width: number, height: number) {
    this.gl = gl
    let shader: ShaderObject = {
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader
    }

    let program: Program = new Program(gl, shader)
    this.program = program.program
    
    this.vertexNum = bufferManager.initBuffer(gl, this.program, this.geometry)
    this.setSize(width, height)
    let uvTransform = new Matrix3()
    uvTransform.setUvTransform(0.5, 0.5, 2, 2, 0, 0, 0)
    var location = gl.getUniformLocation(this.program, 'uvTransform');
    gl.uniformMatrix3fv(location, false, uvTransform.elements)
  }
  setSize(width: number, height: number) {
    var r = this.gl.getUniformLocation(this.program, 'resolution')
    this.gl.uniform2f(r, width, height);
  }
  getVertexNum(): number {
    return this.vertexNum
  }
  getProgram(): WebGLProgram {
    return this.program
  }
}
export {
  RenderableElement
} 