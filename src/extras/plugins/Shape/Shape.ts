import { BufferManager } from "../../../BufferManager";
import { Float32Attribute } from '../../../Float32Attribute';
import { Geometry } from '../../../Geometry';
import { Matrix3 } from "../../../math/Matrix3";
import { Program, ShaderObject } from "../../../Program";
import { RenderedObject } from "../../../RenderedObject";
import { Uint32Attribute } from '../../../Uint32Attribute';

class Shape extends RenderedObject {
  program: WebGLProgram
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  geometry: Geometry
  uvTransform: Matrix3
  constructor(index, position, fragmentShader: string = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}') {
    super()
    this.fragmentShader = fragmentShader
    // let verties = []
    // let contour = shape.contour
    // for ( var i = 0; i < contour.length; i ++ ) {

    //   verties.push( contour[ i ].x );
    //   verties.push( contour[ i ].y );
  
    // }
    let uvs = position
    this.uvTransform = new Matrix3()
    this.uvTransform.setUvTransform(0.5, 0.5, 2, 2, 0, 0, 0)

    let geometry = new Geometry()

    

    geometry.addAttribute('position', new Float32Attribute(position, 2))
    geometry.addAttribute('uv', new Float32Attribute(uvs, 2))
    geometry.addAttribute('index', new Uint32Attribute(index, 1))
    this.geometry = geometry
  }
  setup(gl: WebGLRenderingContext, bufferManager: BufferManager, width: number, height: number) {
    this.gl = gl
    let shader: ShaderObject = {
      
      vertexShader: `
        attribute vec4 position;
        attribute vec2 uv                                                                                                                                                                                                                                                                                                                       ;
        varying vec2 vUv;
        uniform mat3 uvTransform;
        void main () {
          gl_Position = position;
          gl_PointSize = 3.;
          vUv = ( uvTransform * vec3( uv, 1 ) ).xy;;
        }

      `,
      fragmentShader: this.fragmentShader
    }
    let program: Program = new Program(gl, shader)
    this.program = program.program

    
    var location = gl.getUniformLocation(this.program, 'uvTransform');
    gl.uniformMatrix3fv(location, false, this.uvTransform.elements)
    
    //setup buffer and attribute
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
export { Shape };
