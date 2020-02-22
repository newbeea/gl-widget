import { Attribute } from "./Attribute";


class Uint32Attribute extends Attribute {
  array: Uint32Array
  itemSize: number
  normalized: boolean
  constructor(array: Array<number> | Uint32Array, itemSize: number, normalized: boolean = false) {
    super(itemSize, normalized)
    if (array instanceof Uint32Array) {
      this.array = array
    } else {
      this.array = new Uint32Array(array)
    } 
  }

}
export {
  Uint32Attribute
} 