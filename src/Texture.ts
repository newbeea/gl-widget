interface State {
  needsUpdate: boolean,
  version: number
}
class Texture {
  glTextrue: any;
  image: any
  images: Array<any>
  format: any
  type: any
  version: number
  needsUpdate: boolean
  imageCount: number
  imageLoadedCount: number
  state: State
  constructor (image, format=1, type=1) { // TODO
    this.state = new Proxy( {
      needsUpdate: false,
      version: 0
    }, {
      set: (target, key, value, receiver) => {
        let v = Reflect.set(target, key, value, receiver)
        if (key === 'needsUpdate' && value === true) {
          this.version ++
        }
        return v
      }
    })
    this.imageLoadedCount = 0
    if (image instanceof Array) {
      this.images = image
      this.imageCount = this.images.length
      image.forEach(img => {
        this.addImageListener(img)
      })
    } else {
      this.image = image
      this.imageCount = 1
      this.addImageListener(image)
    }
    
    this.format = format
    this.type = type
    this.version = 0
    this.needsUpdate = false
    this.glTextrue = null
  }
  loadedCallback () {
    this.imageLoadedCount += 1
    if (this.imageLoadedCount == this.imageCount) {
      this.state.needsUpdate = true
    }
  }
  addImageListener (img) {
    if (!img) return
    if (img.complete) {
      this.loadedCallback();
    } else {
        img.onload =  () => {
          this.loadedCallback();
          img.onload = null;
        };
    };
  }
  
  update () {
    this.version ++
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

export default Texture