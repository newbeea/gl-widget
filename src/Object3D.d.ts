import { Matrix4 } from "./math/Matrix4";
import { Vector3 } from "./math/Vector3";
declare class Object3D {
    matrix: Matrix4;
    matrixWorldNeedsUpdate: boolean;
    matrixAutoUpdate: any;
    parent: Object3D;
    children: Array<Object3D>;
    matrixWorld: any;
    readonly position: Vector3;
    readonly quaternion: any;
    readonly scale: Vector3;
    changed: boolean;
    constructor();
    applyMatrix(matrix: any): void;
    updateMatrix(): void;
    updateMatrixWorld(force: any): void;
    rotateOnAxis(axis: any, angle: any): this;
    rotateOnWorldAxis(axis: any, angle: any): this;
    rotateX(angle: any): this;
    rotateY(angle: any): this;
    rotateZ(angle: any): this;
    add(object: Object3D): this;
    traverse(callback: Function): void;
}
export { Object3D };
