
import { ShapeUtils } from '../Triangulate/ShapeUtils';
import { Geometry } from '../../../Geometry'
import { Float32Attribute } from '../../../Float32Attribute'
import { Uint32Attribute } from '../../../Uint32Attribute'
interface FontOptions {
  size ?: number
  divisions ?: number
}
enum Alignment {
  CENTERMIDDLE,
  LEFTBOTTOM,
  LEFTTOP,
  LEFTMIDDEL
}
class ShapeGeometry extends Geometry {
  indices: any[];
  uvs: any[];
  positions: any[];
  
	constructor(shapes, alignment: Alignment = Alignment.CENTERMIDDLE) {
    super();
    this.indices = []
    this.uvs = []
    this.positions = []
    this.generateGeometry(shapes, alignment)
    
  }
  addShape (shape) {
    let shapePoints = shape.extractPoints(12)


    var h,hl,ahole

    var vertices = shapePoints.shape;
    var holes = shapePoints.holes;

    var reverse = ! ShapeUtils.isClockWise( vertices );

    if ( reverse ) {

      vertices = vertices.reverse();

      // Maybe we should also check if holes are in the opposite direction, just to be safe ...

      for ( h = 0, hl = holes.length; h < hl; h ++ ) {

        ahole = holes[ h ];

        if ( ShapeUtils.isClockWise( ahole ) ) {

          holes[ h ] = ahole.reverse();

        }

      }

    }

    let index = ShapeUtils.triangulateShape(vertices, holes)

    let offset = this.positions.length / 3

    index.forEach(i => {
      this.indices.push(offset + i)
    });
    vertices.forEach(element => {
      this.positions.push(element.x, element.y, 0)  
      this.uvs.push(element.x, element.y)
      this.boundingBox.min.x = element.x < this.boundingBox.min.x ? element.x : this.boundingBox.min.x
      this.boundingBox.min.y = element.y < this.boundingBox.min.y ? element.y : this.boundingBox.min.y
      this.boundingBox.max.x = element.x > this.boundingBox.max.x ? element.x : this.boundingBox.max.x
      this.boundingBox.max.y = element.y > this.boundingBox.max.y ? element.y : this.boundingBox.max.y
    });
    let hole = holes.flat()
    hole.forEach(element => {
      this.positions.push(element.x, element.y, 0)  
      this.uvs.push(element.x, element.y)
    });
  }
  setPivot (alignment: Alignment) {
    let x = this.boundingBox.max.x - this.boundingBox.min.x
    let y = this.boundingBox.max.y - this.boundingBox.min.y
    let offsetX: number = 0
    let offsetY: number = 0
    switch (alignment) {
      case Alignment.CENTERMIDDLE:
        offsetX = - x / 2
        offsetY = - y / 2
        break
      case Alignment.LEFTMIDDEL:
        offsetX = 0
        offsetY = - y / 2
        break
      case Alignment.LEFTTOP:
        offsetX = 0
        offsetY = - y
        break
    }
    for(let i = 0; i < this.positions.length; i += 3) {
      this.positions[i] += offsetX
      this.positions[i + 1] += offsetY
    }
    for(let i = 0; i < this.uvs.length; i += 2) {
      this.uvs[i] += offsetX
      this.uvs[i + 1] += offsetY
    }
  }
  generateGeometry (shapes, alignment: Alignment) {
    shapes.forEach(shape => {
      this.addShape(shape)
    });
    this.setPivot(alignment)
    this.addAttribute('position', new Float32Attribute(this.positions, 3))
    this.addAttribute('uv', new Float32Attribute(this.uvs, 2))
    this.addAttribute('index', new Uint32Attribute(this.indices, 1))

  }

}


export { ShapeGeometry, Alignment };
