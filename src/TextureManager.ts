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
    let cached = this.textureCache.get(texture)
    if (!cached) {
      cached = {}
      this.textureCache.set(texture, cached)
    }

    if (!cached.init) {
      cached.glTexture = gl.createTexture();
      cached.init = true
    }
    let glTexture = cached.glTexture
    gl.activeTexture(gl.TEXTURE0 + this.unit)
    gl.bindTexture(gl.TEXTURE_2D, glTexture)

    // if (texture.version > 0 && cached.version !== texture.version) {
    if (texture.image.complete) { 
      cached.version = texture.version
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image)
      gl.generateMipmap( gl.TEXTURE_2D )
    } else {
    // if (texture.version == 0) {
      let im = new ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)
      
    } 
      
 
    
  }
}
export {
  TextureManager
}