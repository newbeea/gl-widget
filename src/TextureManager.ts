import Texture from "./Texture"

class TextureManager {
  unit: number
  gl: WebGLRenderingContext
  textureCache: WeakMap<any, any>
  constructor (gl: WebGLRenderingContext) {
    this.unit = 0
    this.gl = gl
    this.textureCache = new WeakMap()
  }
  setTexture2D(texture: Texture, options) {
    let gl: WebGLRenderingContext = this.gl
    let glTexture: WebGLTexture = this.textureCache.get(texture)
    if (!glTexture) {
      glTexture = gl.createTexture();
      this.textureCache.set(texture, glTexture)
      this.unit += 1
    } 
    gl.activeTexture(gl.TEXTURE0 + this.unit)
    gl.bindTexture(gl.TEXTURE_2D, glTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image)
    gl.generateMipmap( gl.TEXTURE_2D )
    
  }
}
export {
  TextureManager
}