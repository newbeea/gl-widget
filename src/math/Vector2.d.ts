declare class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
    add(v: Vector2): this;
    sub(v: Vector2): this;
    multiply(v: Vector2): this;
    multiplyScalar(scalar: number): this;
    dot(v: Vector2): number;
    length(): number;
    clone(): Vector2;
    copy(v: Vector2): this;
    equals(v: Vector2): boolean;
    subVectors(a: any, b: any): this;
}
export { Vector2 };
