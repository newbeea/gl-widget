
import { Uint32Attribute } from "./Uint32Attribute"
import { Float32Attribute } from "./Float32Attribute"
import { BufferGeometry } from "./BufferGeometry";
class SkyboxGeometry extends BufferGeometry {
  constructor() {
    super()
    this.addAttribute('position', new Float32Attribute([
      1, -1, 1,
      -1, -1, 1,
      -1, -1, -1,
      1, -1, -1,


      1,  1, 1,
      -1,  1, 1,
      -1, 1, -1,
      1, 1, -1,
     
    ], 3))
    this.addAttribute('index', new Uint32Attribute([
      0, 3, 2, 0, 2, 1,  4, 0, 5, 0, 1, 5,  5, 1, 2, 5, 2, 6,  6, 2, 3, 6, 3, 7,  7, 3, 0, 7, 0, 4,  4, 5, 6, 4, 6, 7
    ], 1))
  }
}
export {
  SkyboxGeometry
} 
