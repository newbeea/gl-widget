

import { SkyboxGeometry } from "./SkyboxGeometry";
import { Background } from "./Background";
import { Geometry } from "./Geometry";
import { BufferGeometry } from "./BufferGeometry";
class Skybox extends Background {
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  constructor(material={}, geometry?: Geometry | BufferGeometry) {
    material = Object.assign({
      vertexShader: `
        uniform mat4 mvpMatrix;
        attribute vec3 position;
        varying vec3 vTexCoords;
        void main () {
          vTexCoords = position;
          gl_Position = mvpMatrix*position;
        }
      `,
      fragmentShader:`
        #ifdef GL_ES
        precision mediump float;
        #endif
        uniform samplerCube cube;
        varying vec3 vTexCoords;
        void main() {
          gl_FragColor = textureCube(cube, vTexCoords.xyz);
        }
      `
    }, material)
    
    super(material, geometry || new SkyboxGeometry()) 
  }
}
export {
  Skybox
} 