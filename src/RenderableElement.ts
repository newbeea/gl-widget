
import { ShaderObject, Program } from "./Program";
import { BufferManager } from "./BufferManager";
import { BufferGeometry } from "./BufferGeometry";
import { Object3D } from "./Object3D";

import { RenderSide } from "./Constants";
import { ProgramManager } from "./ProgramManager";
import { Geometry } from "./Geometry";
import { Matrix4 } from "./math/index";
import { Vector3, Matrix3 } from "./math/index";


class RenderableElement extends Object3D {
  material: any;
  glProgram: WebGLProgram
  program: Program
  gl: WebGLRenderingContext
  vertexNum: number
  geometry: Geometry
  bufferGeometry: BufferGeometry
  bufferManager: BufferManager

  programManager: ProgramManager
  side: RenderSide
  transparent: boolean
  hasIndex: boolean;
  isRenderableElement: boolean = true
  type: string = ''
  constructor(material: any = {}, geometry: Geometry | BufferGeometry) {
    super()
    this.material = material

    let commonUniforms = {
      cameraPosition: {
        value: new Vector3()
      },
      mvpMatrix: {
        value: new Matrix4()
      },
      modelMatrix: {
        value: new Matrix4()
      },
      viewMatrix: {
        value: new Matrix4()
      },
      modelViewMatrix: {
        value: new Matrix4()
      },
      projectionMatrix: {
        value: new Matrix4()
      },
      normalMatrix: {
        value: new Matrix3()
      },
      isOrthographic: {
        value: 0
      }
      
    }
    this.material.uniforms = material.uniforms ? Object.assign(material.uniforms, commonUniforms) : commonUniforms

    
    
    // this.transparent = material.transparent || false
    // this.side = material.side || RenderSide.FRONT
    if (geometry instanceof Geometry) {
      this.geometry = geometry
      this.bufferGeometry = this.geometry.toBufferGeometry()
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
      vertexShader: this.material.vertexShader,
      fragmentShader: this.material.fragmentShader
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
  updateGeometry(gl) {
    if (!this.bufferManager) {
      this.bufferManager = new BufferManager()
    
    }
    if (this.geometry) {
      this.bufferGeometry = this.geometry.toBufferGeometry()
    }
    let format: any = this.bufferManager.initBuffer(gl, this.glProgram, this.bufferGeometry)
    this.vertexNum = format.count
    this.hasIndex = format.hasIndex
  }
  updateBuffer(gl) {
    if (!this.bufferManager) {
      this.bufferManager = new BufferManager()
      let format: any = this.bufferManager.initBuffer(gl, this.glProgram, this.bufferGeometry)
      this.vertexNum = format.count
      this.hasIndex = format.hasIndex
    } else {
      this.bufferManager.bindBuffer(gl, this.glProgram, this.bufferGeometry)
    }  
  }
  updateUniforms(gl) {
    this.program.uniformManager.updateUniforms(this.material.uniforms)
  }
}
export {
  RenderableElement
} 