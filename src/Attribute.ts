

class Attribute {
  array: Uint8Array | Float32Array
  itemSize: number
  normalized: boolean
  constructor(array: Array<number>, itemSize: number, normalized: boolean = false) {
    this.itemSize = itemSize
    this.normalized = normalized
  }

}
export {
  Attribute
} 