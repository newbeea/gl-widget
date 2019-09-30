import { Geometry } from '../../../Geometry'
import { Uint8Attribute } from '../../../Uint8Attribute'
import { Float32Attribute } from '../../../Float32Attribute'
import { ShaderObject, Program } from "../../../Program";
import { ShapeUtils } from "./ShapeUtils";
import { BufferManager } from "../../../BufferManager";
import { RenderedObject } from "../../../RenderedObject";
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
        attribute vec4 a_Position;
        void main () {
          gl_Position = a_Position;
        }

      `,
      fragmentShader: this.fragmentShader
    }
    let program: Program = new Program(gl, shader)
    this.program = program.program


    let verties = [
      -0.5, 0.5,  -0.5, -0.5,  0.5, -0.5,  0.5, 0.5
    ]
    let geometry = new Geometry()
    let shape = ShapeUtils.triangulateShape(verties, [])

    geometry.addAttribute('positon', new Float32Attribute(verties, 2))
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