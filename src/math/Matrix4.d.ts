declare class Matrix4 {
    elements: Array<number>;
    constructor();
    set(n11: any, n12: any, n13: any, n14: any, n21: any, n22: any, n23: any, n24: any, n31: any, n32: any, n33: any, n34: any, n41: any, n42: any, n43: any, n44: any): this;
    copy(m: any): this;
    multiplyMatrices(a: any, b: any): this;
    multiply(m: any): this;
    makeTranslation(x: any, y: any, z: any): this;
    makeScale(x: any, y: any, z: any): this;
    makePerspective(left: any, right: any, top: any, bottom: any, near: any, far: any): this;
    makeOrthographic(left: any, right: any, top: any, bottom: any, near: any, far: any): this;
    identity(): this;
    getInverse(m: any): this;
    compose(position: any, quaternion: any, scale: any): this;
    decompose(position: any, quaternion: any, scale: any): this;
    determinant(): number;
    clone(): Matrix4;
    fromArray(array: any, offset?: number): this;
    extractRotation(m: any): this;
    lookAt(eye: any, target: any, up: any): this;
}
export { Matrix4 };
