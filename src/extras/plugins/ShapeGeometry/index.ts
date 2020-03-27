
import { ShapeUtils } from '../Triangulate/ShapeUtils';
import { BufferGeometry } from '../../../BufferGeometry'
import { Float32Attribute } from '../../../Float32Attribute'
import { Uint32Attribute } from '../../../Uint32Attribute'
interface FontOptions {
  size ?: number
  divisions ?: number
}
enum Alignment {
  NONE,
  CENTERMIDDLE,
  LEFTBOTTOM,
  LEFTTOP,
  LEFTMIDDEL
}
enum Flip {
  TOPBOTTOM,
  LEFTRIGHT,
  LEFTTOP,
  RIGHTTOP
}
class ShapeGeometry extends BufferGeometry {
  indices: any[];
  uvs: any[];
  positions: any[];
  
	constructor() {
    super();
    this.indices = []
    this.uvs = []
    this.positions = []
    // this.generateGeometry(shapes, alignment, flip)
    
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
  layout (alignment?: Alignment, flip?: Flip) {
    let x = this.boundingBox.max.x - this.boundingBox.min.x
    let y = this.boundingBox.max.y - this.boundingBox.min.y
    let offsetX: number = 0
    let offsetY: number = 0

    switch (alignment) {
      case Alignment.CENTERMIDDLE:
        offsetX = - x / 2 - this.boundingBox.min.x
        offsetY = - y / 2 - this.boundingBox.min.y
        break
      case Alignment.LEFTMIDDEL:
        offsetX = 0 - this.boundingBox.min.x
        offsetY = - y / 2 - this.boundingBox.min.y
        break
      case Alignment.LEFTTOP:
        offsetX = 0 - this.boundingBox.min.x
        offsetY = - y - this.boundingBox.min.y
        break
      case Alignment.LEFTBOTTOM:
        offsetX = - this.boundingBox.min.x
        offsetY = - this.boundingBox.min.y
        break
    }
    for(let i = 0, j = 0; i < this.positions.length; i += 3, j += 2) {
      this.positions[i] += offsetX
      this.positions[i + 1] += offsetY

      this.uvs[j] += offsetX
      this.uvs[j + 1] += offsetY

      if (flip === Flip.TOPBOTTOM) {
        this.positions[i + 1] = - this.positions[i + 1]
        this.uvs[j + 1] = - this.uvs[j + 1]
      } else if (flip === Flip.LEFTRIGHT) {
        this.positions[i] = - this.positions[i]
        this.uvs[j] = - this.uvs[j]
      } else if (flip === Flip.LEFTTOP) {
        let tmp = this.positions[i]
        this.positions[i] = this.positions[i + 1]
        this.positions[i + 1] = tmp

        tmp = this.uvs[j]
        this.uvs[j] = this.uvs[j]
        this.uvs[j] = tmp
      } else if (flip === Flip.RIGHTTOP) {
        let tmp = this.positions[i]
        this.positions[i] = -this.positions[i + 1]
        this.positions[i + 1] = -tmp
        
        tmp = this.uvs[j]
        this.uvs[j] = -this.uvs[j]
        this.uvs[j] = -tmp
      }
      
    }

  }
  generateGeometry (shapes, alignment: Alignment, flip?: Flip) {
    shapes.forEach(shape => {
      this.addShape(shape)
    });

    this.layout(alignment, flip)
    this.addAttribute('position', new Float32Attribute(this.positions, 3))
    this.addAttribute('uv', new Float32Attribute(this.uvs, 2))
    this.addAttribute('index', new Uint32Attribute(this.indices, 1))

  }

}


export { ShapeGeometry, Alignment, Flip };
