import { RenderableElement } from "./RenderableElement";
import { Geometry } from "./Geometry";
import { BufferGeometry } from "./BufferGeometry";

class Points extends RenderableElement {
  constructor(shader?: any, geometry?: Geometry | BufferGeometry) {
    shader = Object.assign({
      vertexShader: `
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        
        attribute vec3 position;
        void main () {
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

				  gl_PointSize = 0.2 * ( 300.0 / - mvPosition.z );

				  gl_Position = projectionMatrix * mvPosition;
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
    }, shader)
    super(shader, geometry)
    this.type = 'Points'
  }
}
export {
  Points
}