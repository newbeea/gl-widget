import { ShapeGeometry, Alignment, Flip } from '../ShapeGeometry';
interface SvgOptions {
    size?: number;
    alignment?: Alignment;
    flip?: Flip;
    isCCW?: Boolean;
}
declare class SvgGeometry extends ShapeGeometry {
    constructor(node: any, options?: SvgOptions);
}
export { SvgGeometry };
