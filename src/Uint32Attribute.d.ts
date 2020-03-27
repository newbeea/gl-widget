import { Attribute } from "./Attribute";
declare class Uint32Attribute extends Attribute {
    array: Uint32Array;
    itemSize: number;
    normalized: boolean;
    constructor(array: Array<number> | Uint32Array, itemSize: number, normalized?: boolean);
}
export { Uint32Attribute };
