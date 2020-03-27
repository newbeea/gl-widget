import { BufferGeometry } from '../../../BufferGeometry';
declare enum Alignment {
    NONE = 0,
    CENTERMIDDLE = 1,
    LEFTBOTTOM = 2,
    LEFTTOP = 3,
    LEFTMIDDEL = 4
}
declare enum Flip {
    TOPBOTTOM = 0,
    LEFTRIGHT = 1,
    LEFTTOP = 2,
    RIGHTTOP = 3
}
declare class ShapeGeometry extends BufferGeometry {
    indices: any[];
    uvs: any[];
    positions: any[];
    constructor();
    addShape(shape: any): void;
    layout(alignment?: Alignment, flip?: Flip): void;
    generateGeometry(shapes: any, alignment: Alignment, flip?: Flip): void;
}
export { ShapeGeometry, Alignment, Flip };
