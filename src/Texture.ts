
class Texture {
  image: any
  images: Array<any>
  format: any
  type: any
  version: number
  needsUpdate: boolean
  constructor (image, format=1, type=1) { // TODO
    if (image instanceof Array) {
      this.images = image
    } else {
      this.image = image
    }
    
    this.format = format
    this.type = type
    this.version = 0
    this.needsUpdate = false

    // this.needsUpdate = new Proxy(true, {
    //   set: (target, key, value, receiver) => {
    //     let v = Reflect.set(target, key, value, receiver)
    //     this.updateMatrixWorld(true)
    //     return v
    //   }
    // })
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