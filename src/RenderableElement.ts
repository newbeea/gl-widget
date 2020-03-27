
import { ShaderObject, Program } from "./Program";
import { BufferManager } from "./BufferManager";
import { BufferGeometry } from "./BufferGeometry";
import { Object3D } from "./Object3D";
import { UniformManager } from "./UniformManager";
import { RenderSide } from "./Constants";
import { ProgramManager } from "./ProgramManager";
import { Geometry } from "./Geometry";


class RenderableElement extends Object3D {
  glProgram: WebGLProgram
  program: Program
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  vertexShader: string
  uniforms: any
  geometry: Geometry
  bufferGeometry: BufferGeometry
  bufferManager: BufferManager
  uniformManager: UniformManager
  programManager: ProgramManager
  side: RenderSide
  hasIndex: boolean;

  constructor(material?: any, geometry?: Geometry | BufferGeometry) {
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
    if (geometry instanceof Geometry) {
      this.geometry = geometry
      this.bufferGeometry = this.geometry.toBufferGeometry()
      console.log(this.bufferGeometry)
    } else {
      this.bufferGeometry = geometry
    }
    
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
      let format: any = this.bufferManager.initBuffer(gl, this.glProgram, this.bufferGeometry)
      console.log(format)
      this.vertexNum = format.count
      this.hasIndex = format.hasIndex
    } else {
      this.bufferManager.bindBuffer(gl, this.glProgram, this.bufferGeometry)
    }  
  }
  updateUniforms(gl) {
    this.program.uniformManager.updateUniforms(this.uniforms)
  }
}
export {
  RenderableElement
} 