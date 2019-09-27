

class Attribute {
  array: Float32Array
  itemSize: number
  normalized: boolean
  constructor(array: Array<number>, itemSize: number, normalized: boolean = false) {
    this.array = new Float32Array(array)
    this.itemSize = itemSize
    this.normalized = normalized
  }

}
export {
  Attribute
} 