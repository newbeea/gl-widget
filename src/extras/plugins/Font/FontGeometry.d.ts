import { ShapeGeometry, Alignment } from '../ShapeGeometry';
interface FontOptions {
    font: any;
    size?: number;
    divisions?: number;
    alignment?: Alignment;
}
declare class FontGeometry extends ShapeGeometry {
    text: string;
    data: object;
    options: FontOptions;
    indices: any[];
    uvs: any[];
    positions: any[];
    constructor(text: any, options: FontOptions);
}
export { FontGeometry };
