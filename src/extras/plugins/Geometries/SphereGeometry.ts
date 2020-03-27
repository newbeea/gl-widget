
import { BufferGeometry } from '../../../BufferGeometry'
import { Float32Attribute } from '../../../Float32Attribute'
import { Uint32Attribute } from '../../../Uint32Attribute'
import { Vector3 } from '../../../math/Vector3'

class SphereGeometry extends BufferGeometry {
  indices: any[]
  uvs: any[]
  positions: any[]
  normals: any[]
  // options: any
	constructor(options) {
    super();
    this.indices = []
    this.uvs = []
    this.positions = []
    this.normals = []
    // this.options = options
    this.generateGeometry(options)
  }
  
  generateGeometry (options) {

    let {
      radius=1,
      widthSegments=16,
      heightSegments=16,
      phiStart=0,
      phiLength=Math.PI * 2,
      thetaStart=0,
      thetaLength=Math.PI
    } = options

  
    widthSegments = Math.max( 3, Math.floor( widthSegments ) );
    heightSegments = Math.max( 2, Math.floor( heightSegments ) );
  
    phiStart = phiStart !== undefined ? phiStart : 0;
    phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;
  
    thetaStart = thetaStart !== undefined ? thetaStart : 0;
    thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;
  
    var thetaEnd = thetaStart + thetaLength;
  
    var vertexCount = ( ( widthSegments + 1 ) * ( heightSegments + 1 ) );
  
    var positions = new Float32Attribute( new Float32Array( vertexCount * 3 ), 3 );
    var normals = new Float32Attribute( new Float32Array( vertexCount * 3 ), 3 );
    var uvs = new Float32Attribute( new Float32Array( vertexCount * 2 ), 2 );
  
    var index = 0, vertices = [], normal = new Vector3();
  
    for ( var y = 0; y <= heightSegments; y ++ ) {
  
      var verticesRow = [];
  
      var v = y / heightSegments;
  
      for ( var x = 0; x <= widthSegments; x ++ ) {
  
        var u = x / widthSegments;
  
        var px = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
        var py = radius * Math.cos( thetaStart + v * thetaLength );
        var pz = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
  
        normal.set( px, py, pz ).normalize();
  
        positions.setXYZ( index, px, py, pz );
        normals.setXYZ( index, normal.x, normal.y, normal.z );
        uvs.setXY( index, u, 1 - v );
  
        verticesRow.push( index );
  
        index ++;
  
      }
  
      vertices.push( verticesRow );
  
    }
  
    var indices = [];
  
    for ( var y = 0; y < heightSegments; y ++ ) {
  
      for ( var x = 0; x < widthSegments; x ++ ) {
  
        var v1 = vertices[ y ][ x + 1 ];
        var v2 = vertices[ y ][ x ];
        var v3 = vertices[ y + 1 ][ x ];
        var v4 = vertices[ y + 1 ][ x + 1 ];
  
        if ( y !== 0 || thetaStart > 0 ) indices.push( v1, v2, v4 );
        if ( y !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( v2, v3, v4 );
  
      }
  
    }
    this.addAttribute( 'position', positions );
    this.addAttribute( 'normal', normals );
    this.addAttribute( 'uv', uvs );

    this.addAttribute('index', new Uint32Attribute(indices, 1))

  }

}


export { SphereGeometry };
