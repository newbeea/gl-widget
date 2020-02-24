import { RenderableElement } from '../../../RenderableElement'
import { SphereGeometry } from './SphereGeometry'
class SphereElement extends RenderableElement {
	data: any;
	constructor(material, options) {
    material = Object.assign({
      vertexShader: `
        attribute vec4 position;
        attribute vec4 normal;
        attribute vec2 uv                                                                                                                                                                                                                                                                                                                       ;
        varying vec2 vUv;
        varying vec4 vNormal;
        uniform mat3 uvTransform;
        uniform mat4 mvpMatrix;
        void main () {
          gl_Position = mvpMatrix*position;
          vNormal = normal;
          vUv = ( uvTransform * vec3( uv, 1 ) ).xy;;
        }
      `,
      fragmentShader: 'void main() {\n\tgl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );\n}'
    }, material)
		super(material, new SphereGeometry(options));
  }
}
export {
  SphereElement
}