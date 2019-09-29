import { Attribute } from "./Attribute";
import { Geometry } from "./Geometry";
class BackgroundGeometry extends Geometry {
  attributes: Map<string, Attribute>
  index: Attribute
  constructor() {
    super()
    this.addAttribute('position', new Attribute([
      -1.0, 1.0,  -1.0, -1.0,  1.0, 1.0,  
      1.0, 1.0,  -1.0, -1.0,  1.0, -1.0
    ], 2))
  }
}
export {
  BackgroundGeometry
} 