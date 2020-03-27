import { Attribute } from './Attribute';
declare class Float32Attribute extends Attribute {
    array: Float32Array;
    itemSize: number;
    normalized: boolean;
    constructor(array: Array<number> | Float32Array, itemSize: number, normalized?: boolean);
}
export { Float32Attribute };
