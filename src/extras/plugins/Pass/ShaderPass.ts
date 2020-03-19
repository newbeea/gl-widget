import { Pass } from "../../../Pass";
import { RenderableElement } from "../../../RenderableElement";
import { PlaneGeometry } from "../Geometries/PlaneGeometry";
import { Renderer } from "../../../Renderer";
import { OrthographicCamera } from "../../../cameras/OrthographicCamera";
import Texture from "../../../Texture";

class ShaderPass extends Pass {
  camera: OrthographicCamera;
  textureID: string;
  uniforms: any;
  fullScreenQuad: RenderableElement;
  texture: Texture;
  constructor (material, textureID = 'tDiffuse') {
    super()

    this.textureID = textureID

    this.uniforms = material.uniforms;
    this.camera = new OrthographicCamera( - 1, 1, 1, - 1, -1, 1 )
    this.fullScreenQuad = new RenderableElement(
      material, 
      new PlaneGeometry(2, 2)
    )
    
    this.texture = new Texture(require('../../../../examples/image/MatCap.jpg').default)
    
  }
  render ( renderer: Renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		if ( this.uniforms[ this.textureID ] ) {
			this.uniforms[ this.textureID ].value = this.texture;
      // this.fullScreenQuad.uniforms.tDiffuse.value = this.texture
    }
    
    // console.log(this.renderToScreen, this.fullScreenQuad)
		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			renderer.render(undefined, this.fullScreenQuad, this.camera, true)

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