

import { SkyboxGeometry } from "./SkyboxGeometry";
import { Geometry } from "./Geometry";
import { RenderableElement } from "./RenderableElement";

class SkyBox extends RenderableElement {
  program: WebGLProgram
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  geometry: Geometry
  constructor(material={}, geometry?: Geometry) {
    console.log(1, material)
    material = Object.assign({
      vertexShader: `
        uniform mat4 mvpMatrix;
        attribute vec4 position;
        varying vec4 vTexCoords;
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
        varying vec4 vTexCoords;
        void main() {
          gl_FragColor = textureCube(cube, vTexCoords.xyz);
        }
      `
    }, material)
    console.log(material)
    super(material, geometry || new SkyboxGeometry())   
  }
}
export {
  SkyBox
} 