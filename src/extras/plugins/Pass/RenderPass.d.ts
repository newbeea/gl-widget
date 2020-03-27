import { Pass } from "../../../Pass";
import { Object3D, Background, Renderer } from "../../../Renderer";
import { Camera } from "../../../cameras/Camera";
declare class RenderPass extends Pass {
    background: Background;
    camera: Camera;
    scene: Object3D;
    constructor(background: Background, scene: Object3D, camera: Camera);
    render(renderer: Renderer, writeBuffer: any, readBuffer: any): void;
}
export { RenderPass };
