
import { ShaderObject, Program } from "./Program";
import { BufferManager } from "./BufferManager";
import { Geometry } from "./Geometry";
import { Object3D } from "./Object3D";
import { UniformManager } from "./UniformManager";
import { RenderSide } from "./Constants";
import { ProgramManager } from "./ProgramManager";


class RenderableElement extends Object3D {
  glProgram: WebGLProgram
  program: Program
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  vertexShader: string
  uniforms: any
  geometry: Geometry
  bufferManager: BufferManager
  uniformManager: UniformManager
  programManager: ProgramManager
  side: RenderSide

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
    if (material.uniforms) {
      this.uniforms = material.uniforms
    }

    this.side = material.side || RenderSide.FRONT
    this.geometry = geometry
    this.programManager = new ProgramManager()
  }

  getVertexNum(): number {
    return this.vertexNum
  }
  getProgram(): WebGLProgram {
    return this.glProgram
  }

  update(gl, material?:any ) {
    let shader: ShaderObject = material ? material : {
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader
    }

    
    this.program = this.programManager.getProgram(gl, shader)
    this.glProgram = this.program.program
    // if (!this.program) {
    //   this.program  = new Program(gl, shader)
    //   this.glProgram = this.program.program
    // }
    gl.useProgram(this.glProgram)
    this.updateBuffer(gl)
    this.updateUniforms(gl)
    
  }
  updateBuffer(gl) {
    if (!this.bufferManager) {
      this.bufferManager = new BufferManager()
      this.vertexNum = this.bufferManager.initBuffer(gl, this.glProgram, this.geometry)
    } else {
      this.bufferManager.bindBuffer(gl, this.glProgram, this.geometry)
    }  
  }
  updateUniforms(gl) {
    this.program.uniformManager.updateUniforms(this.uniforms)
  }
}
export {
  RenderableElement
} 