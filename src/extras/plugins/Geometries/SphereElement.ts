import { RenderableElement } from '../../../RenderableElement'
import { SphereGeometry } from './SphereGeometry'
class SphereElement extends RenderableElement {
	data: any;
	constructor(material, options) {
    material = Object.assign({
      vertexShader: `
        attribute vec4 position;
        attribute vec2 uv                                                                                                                                                                                                                                                                                                                       ;
        varying vec2 vUv;
        uniform mat3 uvTransform;
        uniform mat4 mvpMatrix;
        void main () {
          gl_Position = mvpMatrix*position;
          vUv = ( uvTransform * vec3( uv, 1 ) ).xy;;
        }
      `
    }, material)
		super(material, new SphereGeometry(options));
  }
}
export {
  SphereElement
}