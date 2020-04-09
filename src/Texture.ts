import { Encoding } from "./Constants";

interface State {
  needsUpdate: boolean,
  version: number
}
class Texture {
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
  constructor (imageSrc?, format=1, type=1) { // TODO
    
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
    
    this.format = format
    this.type = type
    
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

		// this.name = source.name;

		this.image = source.image;
		// this.mipmaps = source.mipmaps.slice( 0 );

		// this.mapping = source.mapping;

		// this.wrapS = source.wrapS;
		// this.wrapT = source.wrapT;

		// this.magFilter = source.magFilter;
		// this.minFilter = source.minFilter;

		// this.anisotropy = source.anisotropy;

		this.format = source.format;
		this.type = source.type;

		// this.offset.copy( source.offset );
		// this.repeat.copy( source.repeat );
		// this.center.copy( source.center );
		// this.rotation = source.rotation;

		// this.matrixAutoUpdate = source.matrixAutoUpdate;
		// this.matrix.copy( source.matrix );

		// this.generateMipmaps = source.generateMipmaps;
		// this.premultiplyAlpha = source.premultiplyAlpha;
		// this.flipY = source.flipY;
		// this.unpackAlignment = source.unpackAlignment;
		// this.encoding = source.encoding;

		return this;

	}
}

export {
  Texture
}