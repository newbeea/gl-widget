import { RenderSide, Texture } from "@gl-widget/gl-widget";

class TextureMaterial {
  vertexShader: string
  fragmentShader:string
  uniforms: any
  side: RenderSide;
  transparent = false 
  constructor (tDiffuse: Texture = null) {
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
    this.uniforms = {

      "tDiffuse": { value: tDiffuse },
      "opacity": { value: 1.0 }

    }
    this.side = RenderSide.DOUBLE

  }
}
export default TextureMaterial