import { Pass } from "../../../Pass";
import { RenderableElement } from "../../../RenderableElement";
import { PlaneGeometry } from "../Geometries/PlaneGeometry";
import { Renderer } from "../../../Renderer";
import { OrthographicCamera } from "../../../cameras/OrthographicCamera";

class ShaderPass extends Pass {
  camera: OrthographicCamera;
  textureID: string;
  uniforms: any;
  fullScreenQuad: RenderableElement;
  constructor (material, textureID = 'tDiffuse') {
    super()

    this.textureID = textureID

    this.uniforms = material.uniforms;
    this.camera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 )
    this.fullScreenQuad = new RenderableElement(
      material, 
      new PlaneGeometry(2, 2)
    )
  }
  render ( renderer: Renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}
    console.log(this.renderToScreen)
		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			renderer.renderElement(this.fullScreenQuad, this.camera)

		} else {

			renderer.setRenderTarget( writeBuffer );
			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			// if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			renderer.renderElement(this.fullScreenQuad, this.camera)


		}

	}
}
export {
  ShaderPass
}