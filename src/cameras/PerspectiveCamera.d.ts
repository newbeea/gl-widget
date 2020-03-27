import { Matrix4 } from "../math/Matrix4";
import { Camera } from "./Camera";
declare class PerspectiveCamera extends Camera {
    projectionMatrix: Matrix4;
    fov: number;
    zoom: number;
    near: number;
    far: number;
    focus: number;
    aspect: number;
    filmGauge: number;
    filmOffset: number;
    constructor(fov: any, aspect: any, near: any, far: any);
    getFilmWidth(): number;
    updateProjectionMatrix(): void;
}
export { PerspectiveCamera };
