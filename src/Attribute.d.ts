declare class Attribute {
    array: Uint32Array | Float32Array;
    itemSize: number;
    normalized: boolean;
    constructor(itemSize: number, normalized?: boolean);
    setXY(index: any, x: any, y: any): Attribute;
    setXYZ(index: any, x: any, y: any, z: any): this;
}
export { Attribute };
