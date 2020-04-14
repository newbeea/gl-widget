

import { Background } from "./Background";
import { Geometry } from "./Geometry";
import { BufferGeometry } from "./BufferGeometry";
import { Float32Attribute } from "./Float32Attribute";
import { Uint32Attribute } from "./Uint32Attribute";
class Skybox extends Background {
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  constructor(shader={}, geometry?: Geometry | BufferGeometry) {
    shader = Object.assign({
      vertexShader: `
        uniform mat4 mvpMatrix;
        attribute vec3 position;
        varying vec3 vPosition;
        void main () {
          vPosition = position;
          gl_Position = mvpMatrix * vec4(position, 1.);
        }
      `,
      fragmentShader:`
        #ifdef GL_ES
        precision mediump float;
        #endif
        uniform samplerCube cube;
        varying vec3 vPosition;
        void main() {
          gl_FragColor = textureCube(cube, vPosition.xyz);
        }
      `
    }, shader)
    if (!geometry) {
      geometry = new BufferGeometry()
      geometry.addAttribute('position', new Float32Attribute([
        1, -1, 1,
        -1, -1, 1,
        -1, -1, -1,
        1, -1, -1,
  
  
        1,  1, 1,
        -1,  1, 1,
        -1, 1, -1,
        1, 1, -1,
       
      ], 3))
      geometry.addAttribute('index', new Uint32Attribute([
        0, 3, 2, 0, 2, 1,  4, 0, 5, 0, 1, 5,  5, 1, 2, 5, 2, 6,  6, 2, 3, 6, 3, 7,  7, 3, 0, 7, 0, 4,  4, 5, 6, 4, 6, 7
      ], 1))
    }
    super(shader, geometry) 
  }
}
export {
  Skybox
} 