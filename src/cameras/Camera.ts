import { Matrix4 } from "../math/Matrix4"

class Camera {
  projectionMatrix: Matrix4
  matrixWorldInverse: Matrix4
  matrixWorld: Matrix4
  copy: any
  constructor() {
    this.projectionMatrix = new Matrix4()
    this.matrixWorldInverse = new Matrix4()
    this.matrixWorld = new Matrix4()
    this.matrixWorld.makeTranslation(0, 0, 10)

    this.updateMatrixWorld(true)
  }
  updateMatrixWorld ( force ) {

		this.matrixWorldInverse.getInverse( this.matrixWorld );

	}
}
export { Camera }