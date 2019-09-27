import { Attribute } from "./Attribute";
class Geometry {
  attributes: Map<string, Attribute>
  index: Attribute
  constructor() {
    this.attributes = new Map()
    this.index = null
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