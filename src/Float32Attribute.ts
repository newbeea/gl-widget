import { Attribute } from './Attribute'


class Float32Attribute extends Attribute {
  array: Float32Array
  itemSize: number
  normalized: boolean
  constructor(array: Array<number> | Float32Array, itemSize: number, normalized: boolean = false) {
    super(itemSize, normalized)
    if (array instanceof Float32Array) {
      this.array = array
    } else {
      this.array = new Float32Array(array)
    } 
  }
}
export {
  Float32Attribute
} 