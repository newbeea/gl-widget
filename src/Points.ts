import { RenderableElement } from "./RenderableElement";
import { Geometry } from "./Geometry";
import { BufferGeometry } from "./BufferGeometry";

class Points extends RenderableElement {
  constructor(material?: any, geometry?: Geometry | BufferGeometry) {
    material = Object.assign({
      vertexShader: `
        uniform mat4 mvpMatrix;
        attribute vec4 position;
        void main () {
          gl_PointSize = 2.0;
          gl_Position = mvpMatrix*position;
        }
      `,
      fragmentShader:`
        #ifdef GL_ES
        precision mediump float;
        #endif
        void main() {
          if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.5 ) discard;
          gl_FragColor = vec4(1.0);
        }
      `
    }, material)
    super(material, geometry)
    this.type = 'Points'
  }
}
export {
  Points
}