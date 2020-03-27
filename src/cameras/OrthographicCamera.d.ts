import { Camera } from "./Camera";
declare class OrthographicCamera extends Camera {
    zoom: number;
    left: any;
    right: any;
    top: any;
    bottom: any;
    near: any;
    far: any;
    updateProjectionMatrix(): void;
    constructor(left: any, right: any, top: any, bottom: any, near: any, far: any);
}
export { OrthographicCamera };
