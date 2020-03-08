import { Matrix4 } from "../math/Matrix4"
import { Object3D } from "../Object3D";
import { Vector3 } from "../math/Vector3";

class Camera extends Object3D {
  projectionMatrix: Matrix4
  matrixWorldInverse: Matrix4
  // matrixWorld: Matrix4
  up: Vector3
  copy: any
  constructor() {
    super()
    this.up = new Vector3(0, 1, 0)
    this.projectionMatrix = new Matrix4()
    this.matrixWorldInverse = new Matrix4()
    // this.matrixWorld = new Matrix4()
    // this.matrixWorld.makeTranslation(0, 0, 10)
    // this.position.z = 10

    
  }
  lookAt( vector ) {
    var m1 = new Matrix4();
    m1.lookAt( this.position, vector, this.up );
    this.quaternion.setFromRotationMatrix( m1 );

  }
  updateMatrixWorld ( force ) {

		super.updateMatrixWorld( force );

		this.matrixWorldInverse.getInverse( this.matrixWorld );

	}

}
export { Camera }