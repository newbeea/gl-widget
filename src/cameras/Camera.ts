import { Matrix4 } from "../math/Matrix4"
import { Object3D } from "../Object3D";
import { Vector3 } from "../math/Vector3";
import { CameraType } from "../Constants";

class Camera extends Object3D {
  projectionMatrix: Matrix4
  matrixWorldInverse: Matrix4
  // matrixWorld: Matrix4
  up: Vector3
  target: Vector3
  copy: any
  type: CameraType
  zoom: number
  constructor() {
    super()
    this.up = new Vector3(0, 1, 0)
    this.projectionMatrix = new Matrix4()
    this.matrixWorldInverse = new Matrix4()
    // this.matrixWorld = new Matrix4()
    // this.matrixWorld.makeTranslation(0, 0, 10)
    this.target = new Vector3()
    // this.position.z = 10
    
  }
  lookTarget( target?: Vector3 ) {
    target = target || this.target
    var m1 = new Matrix4();
    m1.lookAt( this.position, target, this.up )
    this.quaternion.setFromRotationMatrix( m1 );

  }
  updateMatrixWorld ( force ) {

		super.updateMatrixWorld( force );
		this.matrixWorldInverse.getInverse( this.matrixWorld );

	}
  updateProjectionMatrix () {}
}
export { Camera }