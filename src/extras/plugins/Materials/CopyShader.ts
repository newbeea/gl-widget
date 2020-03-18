import { Vector3 } from "../../../math/Vector3";
class CopyShader {
  vertexShader: string
  fragmentShader:string
  uniforms: any
  constructor () {
    this.vertexShader = `
      attribute vec4 position;
      attribute vec4 normal;
      attribute vec2 uv;

      varying vec2 vUv;
      uniform mat4 mvpMatrix;
      void main() {
        vUv = uv;
        gl_Position = mvpMatrix * vec4( position );
      }
    `
   this.fragmentShader = `
      precision mediump float;
      uniform sampler2D tDiffuse;
      uniform float opacity;
      varying vec2 vUv;
      
      void main() {

        vec4 texel = texture2D( tDiffuse, vUv );
        gl_FragColor = opacity * texel;
      }
    `
    this.uniforms= {

      "tDiffuse": { value: null },
      "opacity": { value: 1.0 }

    }
  }
}
export default CopyShader