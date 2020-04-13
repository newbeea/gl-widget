import { Texture } from "./Texture"
import { TextureManager } from "./TextureManager"

class RenderTarget  {
  width: number
  height: number
  texture: Texture
  frameBuffer: any
  textureBuffer: any
  depthTexture: Texture
  gl: WebGLRenderingContext
  textureManager: TextureManager
  depthBuffer: boolean = true
  constructor (gl: WebGLRenderingContext, width, height, options = {}) {
    this.gl = gl
    this.textureManager = new TextureManager(gl)
    this.width = width
    this.height = height
    this.texture = new Texture()
    this.depthTexture = new Texture()
    
    this.setup(width, height)
  }
  setup(width, height) {
    this.frameBuffer = this.gl.createFramebuffer()
  
    this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, this.frameBuffer );
    
    this.textureManager.createTexture(this.texture, width, height)
    this.gl.framebufferTexture2D( this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture.glTexture, 0 );
    if ( this.depthBuffer ) {
      this.textureManager.createTexture(this.depthTexture, width, height, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT)
      this.gl.framebufferTexture2D( this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture.glTexture, 0 );
    }
    this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, null );
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