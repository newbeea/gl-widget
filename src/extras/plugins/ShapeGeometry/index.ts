
import { ShapeUtils } from '../Triangulate/ShapeUtils';
import { Geometry } from '../../../Geometry'
import { Float32Attribute } from '../../../Float32Attribute'
import { Uint32Attribute } from '../../../Uint32Attribute'
interface FontOptions {
  size ?: number
  divisions ?: number
}
class ShapeGeometry extends Geometry {
  indices: any[];
  uvs: any[];
  positions: any[];
	constructor(shapes) {
    super();
    this.indices = []
    this.uvs = []
    this.positions = []
    this.generateGeometry(shapes)
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
    });
    let hole = holes.flat()
    hole.forEach(element => {
      this.positions.push(element.x, element.y, 0)  
      this.uvs.push(element.x, element.y)
    });

    
  }
  generateGeometry (shapes) {
    shapes.forEach(shape => {
      this.addShape(shape)
    });
    this.addAttribute('position', new Float32Attribute(this.positions, 3))
    this.addAttribute('uv', new Float32Attribute(this.uvs, 2))
    this.addAttribute('index', new Uint32Attribute(this.indices, 1))

  }

}


export { ShapeGeometry };
