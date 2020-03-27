import { BufferGeometry } from "./BufferGeometry";
declare class Geometry {
    sameIndex: boolean;
    positions: [][];
    cells: [][];
    vertexUVs: [][];
    faceUVs: [][];
    vertexNormals: [][];
    normalIndices: [][];
    faceNormals: [][];
    constructor(data?: any, sameIndex?: boolean);
    toBufferGeometry(): BufferGeometry;
}
export { Geometry };
