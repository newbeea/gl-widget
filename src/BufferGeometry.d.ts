import { Attribute } from './Attribute';
import { Box3 } from './math/Box3';
declare class BufferGeometry {
    attributes: Map<string, Attribute>;
    index: Attribute;
    boundingBox: Box3;
    constructor();
    addAttribute(name: string, attribute: Attribute): void;
}
export { BufferGeometry };
