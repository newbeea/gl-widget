import { Attribute } from "./Attribute";


class Uint8Attribute extends Attribute {
  array: Uint8Array
  itemSize: number
  normalized: boolean
  constructor(array: Array<number>, itemSize: number, normalized: boolean = false) {
    super(array, itemSize, normalized)
    this.array = new Uint8Array(array)
  }

}
export {
  Uint8Attribute
} 