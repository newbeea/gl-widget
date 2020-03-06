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
      cached.glTexture = gl.createTexture();
      this.textureCache.set(texture, cached)
    }

    let glTexture = cached.glTexture
    gl.activeTexture(gl.TEXTURE0 + this.unit)
    gl.bindTexture(gl.TEXTURE_2D, glTexture)
    gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true )
    
    if (texture.image.complete) {
    // if (texture.version > 0 && cached.version !== texture.version) { 
      cached.version = texture.version
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image)
      gl.generateMipmap( gl.TEXTURE_2D )
    } else {
    // if (texture.version == 0) {
      let im = new ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)     
    } 
    this.unit ++
        
  }
  setTextureCube(texture: Texture, options) {
    let gl: WebGLRenderingContext = this.gl
    let cached = this.textureCache.get(texture)
    if (!cached) {
      cached = {}
      cached.glTexture = gl.createTexture();
      this.textureCache.set(texture, cached)
    }

    let glTexture = cached.glTexture
    gl.activeTexture(gl.TEXTURE0 + this.unit)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture)
    gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true )
    for (let i = 0; i < 6; i++) {
      let image = texture.images[i]
      if (image.complete) {
        // if (texture.version > 0 && cached.version !== texture.version) { 
          // cached.version = texture.version
          gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
          
        } else {
        // if (texture.version == 0) {
          let im = new ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1, 1)
          gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)     
        } 
    }
    gl.generateMipmap( gl.TEXTURE_CUBE_MAP )
    
    this.unit ++
        
  }
}
export {
  TextureManager
}