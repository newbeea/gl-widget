import { Matrix4 } from "../math/Matrix4";
import { Object3D } from "../Object3D";
import { Vector3 } from "../math/Vector3";
declare class Camera extends Object3D {
    projectionMatrix: Matrix4;
    matrixWorldInverse: Matrix4;
    up: Vector3;
    target: Vector3;
    copy: any;
    constructor();
    lookTarget(target?: Vector3): void;
    updateMatrixWorld(force: any): void;
}
export { Camera };
