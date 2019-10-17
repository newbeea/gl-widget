
import { ShaderObject, Program } from "./Program";
import { BackgroundGeometry } from "./BackgroundGeometry";
import { BufferManager } from "./BufferManager";
import { Geometry } from "./Geometry";
import { RenderableElement } from "./RenderableElement";

class Background extends RenderableElement {
  program: WebGLProgram
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  geometry: Geometry
  constructor(fragmentShader: string = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}', geometry?: Geometry) {
    super({
      fragmentShader: fragmentShader
    }, geometry || new BackgroundGeometry())   
  }
}
export {
  Background
} 