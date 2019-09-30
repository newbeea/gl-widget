
import { Uint8Attribute } from "./Uint8Attribute"
import { Float32Attribute } from "./Float32Attribute"
import { Geometry } from "./Geometry";
class BackgroundGeometry extends Geometry {
  constructor() {
    super()
    this.addAttribute('position', new Float32Attribute([
      -1.0, 1.0,  -1.0, -1.0,  1.0, 1.0,  1.0, -1.0
    ], 2))
    this.addAttribute('index', new Uint8Attribute([
      0, 1, 2, 2, 1, 3
    ], 1))
  }
}
export {
  BackgroundGeometry
} 