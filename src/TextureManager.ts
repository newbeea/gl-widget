import { Texture } from "./Texture"
import WebGL from "./WebGL";
import { Wrapping, TextureFilter } from "./Constants";



class TextureManager {
  unit: number
  gl: WebGLRenderingContext
  textureCache: WeakMap<any, any>
  constructor (gl: WebGLRenderingContext) {
    this.unit = 0
    this.gl = gl
    this.textureCache = new WeakMap()
  }
  getGLWrapping (wrapping: Wrapping) {
    let gl = this.gl
    let wrappingToGL = {
      [ Wrapping.RepeatWrapping ]: gl.REPEAT,
      [ Wrapping.ClampToEdgeWrapping ]: gl.CLAMP_TO_EDGE,
      [ Wrapping.MirroredRepeatWrapping ]: gl.MIRRORED_REPEAT
    }
    return wrappingToGL[wrapping]
  }
  getGLFilter (filter: TextureFilter) {
    let gl = this.gl
    let filterToGL = {
      [ TextureFilter.NearestFilter ]: gl.NEAREST,
      [ TextureFilter.NearestMipmapNearestFilter ]: gl.NEAREST_MIPMAP_NEAREST,
      [ TextureFilter.NearestMipmapLinearFilter ]: gl.NEAREST_MIPMAP_LINEAR,
    
      [ TextureFilter.LinearFilter ]: gl.LINEAR,
      [ TextureFilter.LinearMipmapNearestFilter ]: gl.LINEAR_MIPMAP_NEAREST,
      [ TextureFilter.LinearMipmapLinearFilter ]: gl.LINEAR_MIPMAP_LINEAR
    };
    return filterToGL[filter]
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
  setTexture2D(texture: Texture, unit) {

    // if (!texture) return
    let gl: WebGLRenderingContext = this.gl
    let cached = this.textureCache.get(texture)

    if (!cached) {
      cached = {
        version: 0,
      }
      this.textureCache.set(texture, cached)
    }

    if (texture.image && texture.version > 0 && cached.version != texture.version) {
        // console.log(cached.version, texture.version)
      texture.glTexture =texture.glTexture ? texture.glTexture : gl.createTexture()
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(gl.TEXTURE_2D, texture.glTexture)

      gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, texture.options.flipY );
      gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.options.premultiplyAlpha );
      gl.pixelStorei( gl.UNPACK_ALIGNMENT, texture.options.unpackAlignment );


      cached.version = texture.version
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.getGLFilter(texture.options.minFilter))
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.getGLFilter(texture.options.magFilter))
      // gl.generateMipmap( gl.TEXTURE_2D )
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.getGLWrapping(texture.options.wrapS));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getGLWrapping(texture.options.wrapT));
      if (texture.options.generateMipmaps) {
        gl.generateMipmap( gl.TEXTURE_2D )
      }
    } 
    gl.activeTexture(gl.TEXTURE0 + unit)

    gl.bindTexture(gl.TEXTURE_2D, texture.glTexture || WebGL.getInstance(gl).getEmptyTexture(gl.TEXTURE_2D))     
  }
  resetUnit() {
    this.unit = 0
  }
  allocateUnit() {
    let currentUnit = this.unit
    this.unit += 1
    return currentUnit
  }
  setTextureCube(texture: Texture, unit) {
    
    let gl: WebGLRenderingContext = this.gl
    let cached = this.textureCache.get(texture)

    if (!cached) {
      cached = {
        version: 0
      }
      this.textureCache.set(texture, cached)
    }

    

    if (texture.images.length && texture.version > 0 && cached.version != texture.version) {
      texture.glTexture = texture.glTexture ? texture.glTexture : gl.createTexture()
      // texture.glTexture = glTexture
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.glTexture)
      for (let i = 0; i < 6; i++) {
        let image = texture.images[i]
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        cached.version = texture.version
      }
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.generateMipmap( gl.TEXTURE_CUBE_MAP )
    }
    gl.activeTexture(gl.TEXTURE0 + unit)

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.glTexture || WebGL.getInstance(gl).getEmptyTexture(gl.TEXTURE_CUBE_MAP)) 
    
        
  }
}
export {
  TextureManager
}