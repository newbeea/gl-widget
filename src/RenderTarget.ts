import Texture from "./Texture"
import { TextureManager } from "./TextureManager"

class RenderTarget  {
  width: number
  height: number
  texture: Texture
  frameBuffer: any
  textureBuffer: any
  gl: WebGLRenderingContext
  textureManager: TextureManager
  constructor (gl: WebGLRenderingContext, width, height, options = {}) {
    this.gl = gl
    this.textureManager = new TextureManager(gl)
    this.width = width
    this.height = height
    this.texture = new Texture()
    
    this.textureManager.createTexture(this.texture, width, height)

    this.frameBuffer = gl.createFramebuffer()
  
    gl.bindFramebuffer( gl.FRAMEBUFFER, this.frameBuffer );
    gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.glTextrue, null );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );
  }
  setupDepthTexture (framebuffer, renderTarget) {
  }
  clone () {
    let renderTarget = new RenderTarget(this.gl, this.width, this.height)
		return renderTarget.copy( this );

	}
	copy ( source ) {

		this.width = source.width;
		this.height = source.height;

		// this.viewport.copy( source.viewport );

		this.texture = source.texture.clone();

		// this.depthBuffer = source.depthBuffer;
		// this.stencilBuffer = source.stencilBuffer;
		// this.depthTexture = source.depthTexture;

		return this;

	}
}
export {
  RenderTarget
}