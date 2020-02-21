

import { BackgroundGeometry } from "./BackgroundGeometry";
import { Geometry } from "./Geometry";
import { RenderableElement } from "./RenderableElement";

class Background extends RenderableElement {
  program: WebGLProgram
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  geometry: Geometry
  constructor(material={}, geometry?: Geometry) {
    material = Object.assign({
      fragmentShader: 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}',
      uniforms: {}
    }, material)
    super(material, geometry || new BackgroundGeometry())   
  }
}
export {
  Background
} 