import { BufferGeometry } from '../../../BufferGeometry';
declare class SphereGeometry extends BufferGeometry {
    indices: any[];
    uvs: any[];
    positions: any[];
    normals: any[];
    constructor(options: any);
    generateGeometry(options: any): void;
}
export { SphereGeometry };
