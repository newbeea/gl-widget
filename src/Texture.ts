
class Texture {
  image: any
  images: Array<any>
  format: any
  type: any
  version: number
  needsUpdate: boolean
  constructor (image, format, type) {
    if (image instanceof Array) {
      console.log(image)
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
}

export default Texture