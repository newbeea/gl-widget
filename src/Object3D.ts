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
  updateMatrix () {

		this.matrix.compose( this.position, this.quaternion, this.scale );
    console.log(this.matrix)
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
}
export {
  Object3D
} 