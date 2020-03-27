

import { BufferGeometry } from "./BufferGeometry";
import { RenderableElement } from "./RenderableElement";
import { PlaneGeometry } from "./extras/plugins/Geometries/PlaneGeometry";
import { Geometry } from "./Geometry";

class Background extends RenderableElement {
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  constructor(material={}, geometry?: Geometry | BufferGeometry) {
    material = Object.assign({
      fragmentShader: 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}',
      uniforms: {}
    }, material)
    super(material, geometry || new PlaneGeometry(2, 2))   
   
  }
}
export {
  Background
} 