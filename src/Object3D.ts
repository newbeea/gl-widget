import { Matrix4 } from "./math/Matrix4"
import { Vector3 } from "./math/Vector3";
import { Quaternion } from "./math/Quaternion";
class Object3D {
  matrix: Matrix4
  matrixWorldNeedsUpdate: boolean;
  matrixAutoUpdate: any;
  parent: Object3D;
  children: Array<Object3D>;
  matrixWorld: any;
  position: Vector3;
  quaternion: any;
  scale: Vector3;
  constructor () {
    this.matrix = new Matrix4()
    this.matrixWorld = new Matrix4()
    this.position = new Vector3()
    this.quaternion = new Quaternion()
    this.scale = new Vector3(1, 1, 1)
    this.parent = null
    this.children = []
    this.matrixAutoUpdate = true
  }
  applyMatrix ( matrix ) {

		this.matrix.multiplyMatrices( matrix, this.matrix );

		this.matrix.decompose( this.position, this.quaternion, this.scale );

  }
  
  updateMatrix () {

		this.matrix.compose( this.position, this.quaternion, this.scale );
		this.matrixWorldNeedsUpdate = true;

	}
  
  updateMatrixWorld ( force ) {

		if ( this.matrixAutoUpdate ) this.updateMatrix();

		if ( this.matrixWorldNeedsUpdate || force ) {

			if ( this.parent === null ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		var children = this.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].updateMatrixWorld( force );

		}

  }
  
  rotateOnAxis ( axis, angle ) {
    var q1 = new Quaternion();
    q1.setFromAxisAngle( axis, angle );

    this.quaternion.multiply( q1 );

    return this;

  }

	rotateOnWorldAxis ( axis, angle ) {
    var q1 = new Quaternion();
    q1.setFromAxisAngle( axis, angle );

    this.quaternion.premultiply( q1 );

    return this;

  }

	rotateX( angle ) {
    var v1 = new Vector3( 1, 0, 0 );
    return this.rotateOnAxis( v1, angle );

  }

	rotateY( angle ) {
    var v1 = new Vector3( 0, 1, 0 )
    return this.rotateOnAxis( v1, angle );

  }

	rotateZ( angle ) {
    var v1 = new Vector3( 0, 0, 1 )
    return this.rotateOnAxis( v1, angle );

  }
}
export {
  Object3D
} 