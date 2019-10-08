import { Geometry } from '../../../Geometry'
import { Uint8Attribute } from '../../../Uint8Attribute'
import { Float32Attribute } from '../../../Float32Attribute'
import { ShaderObject, Program } from "../../../Program";
import { ShapeUtils } from "./ShapeUtils";
import { BufferManager } from "../../../BufferManager";
import { RenderedObject } from "../../../RenderedObject";
import { Matrix3 } from "../../../math/Matrix3"
class Shape extends RenderedObject {
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
        attribute vec2 uv;
        varying vec2 vUv;
        uniform mat3 uvTransform;
        void main () {
          gl_Position = position;
          vUv = ( uvTransform * vec3( uv, 1 ) ).xy;;
        }

      `,
      fragmentShader: this.fragmentShader
    }
    let program: Program = new Program(gl, shader)
    this.program = program.program


    let verties = [
      -0.5, -0.5,  0.5, -0.5,  0.5, 0.5,  -0.5, 0.5
    ]
    let uvs = [
      -0.5, -0.5,  0.5, -0.5,  0.5, 0.5,  -0.5, 0.5
    ]
    let uvTransform = new Matrix3()
    uvTransform.setUvTransform(0.5, 0.5, 1, 1, 0, 0, 0)
    var location = gl.getUniformLocation(this.program, 'uvTransform');
    gl.uniformMatrix3fv(location, false, uvTransform.elements)


    let geometry = new Geometry()
    let shape = ShapeUtils.triangulateShape(verties, [])

    geometry.addAttribute('position', new Float32Attribute(verties, 2))
    geometry.addAttribute('uv', new Float32Attribute(uvs, 2))
    geometry.addAttribute('index', new Uint8Attribute(shape, 1))
    //setup buffer and attribute
    // let bufferManager = new BufferManager()
    this.vertexNum = bufferManager.initBuffer(gl, this.program, geometry)
    this.geometry = geometry
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
  Shape
} 