
import { Shapes } from '../Curve/Shapes';
import { ShapeGeometry, Alignment } from '../ShapeGeometry'


function generateShapes ( text, data, size, divisions) {

  var shapes = [];
  var paths = createPaths( text, size, divisions, data );

  for ( var p = 0, pl = paths.length; p < pl; p ++ ) {

    Array.prototype.push.apply( shapes, paths[ p ].toShapes() );

  }

  return shapes;

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

interface FontOptions {
	font: any
  size ?: number
	divisions ?: number
	alignment ?: Alignment
}

class FontGeometry extends ShapeGeometry {
  text: string;
  data: object;
  options: FontOptions;
  indices: any[];
  uvs: any[];
  positions: any[];
	constructor(text, options: FontOptions) {
		let font = options.font
    options = Object.assign({
      size: 1,
		divisions: 4,
		alignment: Alignment.CENTERMIDDLE
    }, options)
    
	super();

	let shapes = generateShapes(text, font, options.size, options.divisions)
	this.generateGeometry(shapes, options.alignment)
  }
  
}


export { FontGeometry };
