

import { BufferGeometry } from "./BufferGeometry";
import { RenderableElement } from "./RenderableElement";
import { Geometry } from "./Geometry";
import { Float32Attribute } from "./Float32Attribute";
import { Uint32Attribute } from "./Uint32Attribute";

class Background extends RenderableElement {
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  
  constructor(material={}, geometry?: Geometry | BufferGeometry) {
    material = Object.assign({
      vertexShader: `
        attribute vec3 position;
        varying vec3 vPosition;
        void main () {
          vPosition = position;
          gl_Position = vec4(position, 1.);
        }
      `,
      fragmentShader: `
      void main() {
        gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
      }`,
      uniforms: {}
    }, material)
    if (!geometry) {
      geometry = new BufferGeometry()
      geometry.addAttribute('position', new Float32Attribute([
        1, -1, 0,
        1, 1, 0,
        -1, 1, 0,
        -1, -1, 0
       
      ], 3))
      geometry.addAttribute('index', new Uint32Attribute([
        0, 1, 2, 2, 3, 0
      ], 1))
    }
    super(material, geometry || geometry)   
    this.type = 'Background'
   
  }
}
export {
  Background
} 