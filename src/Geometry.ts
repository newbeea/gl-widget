import { Attribute } from './Attribute'
import { Box3 } from './math/Box3'
class Geometry {
  attributes: Map<string, Attribute>
  index: Attribute
  boundingBox: Box3
  constructor() {
    this.attributes = new Map()
    this.index = null
    this.boundingBox = new Box3()
  }
  addAttribute(name: string, attribute: Attribute) {
    if (name === 'index') {
      this.index = attribute
    } else {
      this.attributes.set(name, attribute)
    }
  }
}
export {
  Geometry
} 