import { BufferGeometry } from "../../../BufferGeometry";
import { Float32Attribute } from "../../../Float32Attribute";
import { Uint32Attribute } from "../../../Uint32Attribute";

class PlaneGeometry extends BufferGeometry {
  constructor(width: number = 1, height: number = 1, widthSegments: number = 1, heightSegments: number = 1) {
    super()
    var width_half = width / 2;
    var height_half = height / 2;

    var gridX = Math.floor( widthSegments ) || 1;
    var gridY = Math.floor( heightSegments ) || 1;

    var gridX1 = gridX + 1;
    var gridY1 = gridY + 1;

    var segment_width = width / gridX;
    var segment_height = height / gridY;

    var ix, iy;

    // buffers

    var indices = [];
    var vertices = [];
    var normals = [];
    var uvs = [];

    // generate vertices, normals and uvs

    for ( iy = 0; iy < gridY1; iy ++ ) {

      var y = iy * segment_height - height_half;

      for ( ix = 0; ix < gridX1; ix ++ ) {

        var x = ix * segment_width - width_half;

        vertices.push( x, - y, 0 );

        normals.push( 0, 0, 1 );

        uvs.push( ix / gridX );
        uvs.push( 1 - ( iy / gridY ) );

      }

    }

    // indices

    for ( iy = 0; iy < gridY; iy ++ ) {

      for ( ix = 0; ix < gridX; ix ++ ) {

        var a = ix + gridX1 * iy;
        var b = ix + gridX1 * ( iy + 1 );
        var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
        var d = ( ix + 1 ) + gridX1 * iy;

        // faces

        indices.push( a, b, d );
        indices.push( b, c, d );

      }

    }


    this.addAttribute( 'position', new Float32Attribute( vertices, 3 )  );
    this.addAttribute( 'normal',  new Float32Attribute( normals, 3 ) );
    this.addAttribute( 'uv', new Float32Attribute( uvs, 2 ) );

    this.addAttribute('index', new Uint32Attribute(indices, 1))
  }
}
export {
  PlaneGeometry
}