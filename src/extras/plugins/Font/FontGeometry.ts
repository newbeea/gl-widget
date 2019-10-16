/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author mrdoob / http://mrdoob.com/
 */

import { Shapes } from '../Curve/Shapes';
import { ShapeUtils } from '../Triangulate/ShapeUtils';
import { Geometry } from '../../../Geometry'
import { Float32Attribute } from '../../../Float32Attribute'
import { Uint32Attribute } from '../../../Uint32Attribute'
interface FontOptions {
  size ?: number
  divisions ?: number
}
class FontGeometry extends Geometry {
  text: string;
  data: object;
  options: FontOptions;
	constructor(text, font, options: FontOptions = {}) {
    super();
    this.text = text
    this.data = font
    this.options = Object.assign({
      size: 1,
      divisions: 4
    }, options)
    this.generateGeometry()
  }
  generateGeometry () {
    let shapes = this.generateShapes(this.text, this.options.size, this.options.divisions)

    let shapePoints = shapes[0].extractPoints(12)


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
    let position = []
    let uv = []
    vertices.forEach(element => {
      position.push(element.x, element.y, 0)  
      uv.push(element.x, element.y)
    });
    let hole = holes.flat()
    hole.forEach(element => {
      position.push(element.x, element.y, 0)  
      uv.push(element.x, element.y)
    });

    this.addAttribute('position', new Float32Attribute(position, 3))
    this.addAttribute('uv', new Float32Attribute(uv, 2))
    this.addAttribute('index', new Uint32Attribute(index, 1))

  }
  generateShapes ( text, size, divisions) {

		var shapes = [];
		var paths = createPaths( text, size, divisions, this.data );

		for ( var p = 0, pl = paths.length; p < pl; p ++ ) {

			Array.prototype.push.apply( shapes, paths[ p ].toShapes() );

		}

		return shapes;

	}
}


function createPaths( text, size, divisions, data ) {

	var chars = Array.from ? Array.from( text ) : String( text ).split( '' ); // see #13988
	var scale = size / data.resolution;
	var line_height = ( data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness ) * scale;

	var paths = [];

	var offsetX = 0, offsetY = 0;

	for ( var i = 0; i < chars.length; i ++ ) {

		var char = chars[ i ];

		if ( char === '\n' ) {

			offsetX = 0;
			offsetY -= line_height;

		} else {

			var ret = createPath( char, divisions, scale, offsetX, offsetY, data );
			offsetX += ret.offsetX;
			paths.push( ret.path );

		}

	}

	return paths;

}

function createPath( char, divisions, scale, offsetX, offsetY, data ) {

	var glyph = data.glyphs[ char ] || data.glyphs[ '?' ];

	if ( ! glyph ) return;

	var path = new Shapes();

	var x, y, cpx, cpy, cpx1, cpy1, cpx2, cpy2;

	if ( glyph.o ) {

		var outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) );

		for ( var i = 0, l = outline.length; i < l; ) {

			var action = outline[ i ++ ];

			switch ( action ) {

				case 'm': // moveTo

					x = outline[ i ++ ] * scale + offsetX;
					y = outline[ i ++ ] * scale + offsetY;

					path.moveTo( x, y );

					break;

				case 'l': // lineTo

					x = outline[ i ++ ] * scale + offsetX;
					y = outline[ i ++ ] * scale + offsetY;

					path.lineTo( x, y );

					break;

				case 'q': // quadraticCurveTo

					cpx = outline[ i ++ ] * scale + offsetX;
					cpy = outline[ i ++ ] * scale + offsetY;
					cpx1 = outline[ i ++ ] * scale + offsetX;
					cpy1 = outline[ i ++ ] * scale + offsetY;

					path.quadraticCurveTo( cpx1, cpy1, cpx, cpy );

					break;

				case 'b': // bezierCurveTo

					cpx = outline[ i ++ ] * scale + offsetX;
					cpy = outline[ i ++ ] * scale + offsetY;
					cpx1 = outline[ i ++ ] * scale + offsetX;
					cpy1 = outline[ i ++ ] * scale + offsetY;
					cpx2 = outline[ i ++ ] * scale + offsetX;
					cpy2 = outline[ i ++ ] * scale + offsetY;

					path.bezierCurveTo( cpx1, cpy1, cpx2, cpy2, cpx, cpy );

					break;

			}

		}

	}

	return { offsetX: glyph.ha * scale, path: path };

}

export { FontGeometry };
