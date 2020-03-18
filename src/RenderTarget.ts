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
    this.texture = new Texture(undefined)
    this.textureManager.setRenderTarget(this.texture, width, height)

    this.frameBuffer = gl.createFramebuffer()
  
    gl.bindFramebuffer( gl.FRAMEBUFFER, this.frameBuffer );
    gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureBuffer, null );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );
  }
  setupDepthTexture (framebuffer, renderTarget) {
  }
}
export {
  RenderTarget
}