import Texture from "./Texture"
import WebGL from "./WebGL";

class TextureManager {
  unit: number
  gl: WebGLRenderingContext
  textureCache: WeakMap<any, any>
  constructor (gl: WebGLRenderingContext) {
    this.unit = 0
    this.gl = gl
    this.textureCache = new WeakMap()
  }

  createTexture(texture: Texture, width, height) {
    let gl = this.gl
    texture.glTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
  }
  setTexture2D(texture: Texture, options) {

    // if (!texture) return
    let gl: WebGLRenderingContext = this.gl
    let cached = this.textureCache.get(texture)
    let currentUnit = this.unit
    if (!cached) {
      cached = {
        version: 0
      }
      // console.log(texture)
      this.textureCache.set(texture, cached)
      this.unit ++
      // console.log(this.unit)
    }
    // if (! texture.image)console.log(texture)

    // texture.glTexture =texture.glTexture ? texture.glTexture : gl.createTexture()

    // let glTexture = cached.glTexture
    
    // gl.generateMipmap( gl.TEXTURE_2D )

    if (texture.image && texture.version > 0 && cached.version != texture.version) {
        // console.log(cached.version, texture.version)
      texture.glTexture =texture.glTexture ? texture.glTexture : gl.createTexture()
      gl.activeTexture(gl.TEXTURE0 + currentUnit)
      gl.bindTexture(gl.TEXTURE_2D, texture.glTexture)
      gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true )

      cached.version = texture.version
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      // gl.generateMipmap( gl.TEXTURE_2D )
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, false )
      
    } 
    gl.activeTexture(gl.TEXTURE0 + currentUnit)
    gl.bindTexture(gl.TEXTURE_2D, texture.glTexture || WebGL.getInstance(gl).getEmptyTexture(gl.TEXTURE_2D))     
  }
  setTextureCube(texture: Texture, options) {
    let gl: WebGLRenderingContext = this.gl
    let cached = this.textureCache.get(texture)
    let currentUnit = this.unit
    if (!cached) {
      cached = {
        version: 0
      }
      this.textureCache.set(texture, cached)
      this.unit ++
    }

    

    if (texture.images.length && texture.version > 0 && cached.version != texture.version) {
      texture.glTexture = texture.glTexture ? texture.glTexture : gl.createTexture()
      // texture.glTexture = glTexture
      gl.activeTexture(gl.TEXTURE0 + this.unit)
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.glTexture)
      
      for (let i = 0; i < 6; i++) {
        let image = texture.images[i]
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        cached.version = texture.version
      }
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // gl.generateMipmap( gl.TEXTURE_CUBE_MAP )
    }
    gl.activeTexture(gl.TEXTURE0 + currentUnit)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.glTexture || WebGL.getInstance(gl).getEmptyTexture(gl.TEXTURE_CUBE_MAP)) 
    
        
  }
}
export {
  TextureManager
}