import { Attribute } from "./Attribute";


class Uint32Attribute extends Attribute {
  array: Uint32Array
  itemSize: number
  normalized: boolean
  constructor(array: Array<number>, itemSize: number, normalized: boolean = false) {
    super(array, itemSize, normalized)
    this.array = new Uint32Array(array)
  }

}
export {
  Uint32Attribute
} 