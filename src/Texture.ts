import { Encoding, Mapping, Wrapping, TextureFilter, PixelFormat, TextureDataType } from "./Constants";
import { Object3D } from "./Object3D";


export interface State {
  needsUpdate: boolean,
  version: number
}
export interface TextureOptions {
  mipmaps: Array<any>,
  mapping: Mapping,
  wrapS: Wrapping,
  wrapT: Wrapping,
  magFilter: TextureFilter,
  minFilter: TextureFilter,
  anisotropy: number,
  format: PixelFormat,
  type: TextureDataType,
  flipY: boolean,
  unpackAlignment: number,
  encoding: Encoding,
  generateMipmaps: boolean,
  premultiplyAlpha: boolean

}
class Texture {
  options: TextureOptions;
  mipmaps: Array<any>;
  glTexture: WebGLTexture;
  image: any
  images: Array<any>
  format: any
  type: any
  version: number
  needsUpdate: boolean
  imageCount: number
  imageLoadedCount: number
  state: State
  encoding: Encoding = Encoding.sRGBEncoding
  constructor (imageSrc?, options={}) { // TODO
    
    this.state = new Proxy( {
      needsUpdate: false,
      version: 0
    }, {
      set: (target, key, value, receiver) => {
        let v = Reflect.set(target, key, value, receiver)
        if (key === 'needsUpdate' && value === true) {
          
          this.version ++
          // console.log('version', this.version)
        }
        return v
      }
    })
    this.version = 0
    this.imageLoadedCount = 0
    this.image = null
    this.images = []
    if (imageSrc instanceof Array) {
      
      this.imageCount = imageSrc.length
      imageSrc.forEach(src => {
        let image = new Image()
        image.onload =  () => {
          // console.log('onload')
          this.loadedCallback();
          image.onload = null;
        };
        image.src = src
        this.images.push(image)
      })
    } else if (imageSrc) {
      let image = new Image()
      image.onload =  () => {
        // console.log('onload')
        this.loadedCallback();
        image.onload = null;
      };
      image.src = imageSrc
      this.image = image

      this.imageCount = 1

    }

    this.options = Object.assign({
      mipmaps: [],
      mapping: Mapping.UVMapping,
      wrapS: Wrapping.RepeatWrapping,
      wrapT: Wrapping.RepeatWrapping,
      magFilter: TextureFilter.LinearFilter,
      minFilter: TextureFilter.LinearMipmapLinearFilter,
      anisotropy: 1,
      format: PixelFormat.RGBAFormat,
      type: TextureDataType.UnsignedByteType,
      flipY: true,
      unpackAlignment: 4,
      encoding: Encoding.sRGBEncoding,
      generateMipmaps: true,
      premultiplyAlpha: false

    }, options)
    
    
    this.needsUpdate = false
    this.glTexture = null
  }
  loadedCallback () {
    this.imageLoadedCount += 1
    if (this.imageLoadedCount == this.imageCount) {
      // console.log('image load')
      this.state.needsUpdate = true
    }
  }
  
  clone () {

		return new Texture(undefined).copy( this );

	}

	copy ( source ) {
    this.image = source.image;
    this.images = source.images;
    Object.assign(this.options, source.options)
		return this;

	}
}

export {
  Texture
}