import { Attribute } from "./Attribute";


class Float32Attribute extends Attribute {
  array: Float32Array
  itemSize: number
  normalized: boolean
  constructor(array: Array<number>, itemSize: number, normalized: boolean = false) {
    super(array, itemSize, normalized)
    this.array = new Float32Array(array)
  }

}
export {
  Float32Attribute
} 