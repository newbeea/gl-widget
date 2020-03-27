import { RenderTarget } from "./RenderTarget";
import { Renderer } from "./Renderer";
import { Clock } from "./Clock";
declare class RenderFlow {
    clock: Clock;
    passes: any[];
    renderToScreen: boolean;
    readBuffer: RenderTarget;
    writeBuffer: RenderTarget;
    renderTarget2: RenderTarget;
    renderTarget1: RenderTarget;
    height: number;
    width: number;
    pixelRatio: number;
    renderer: Renderer;
    constructor(renderer: Renderer, renderTarget?: RenderTarget);
    swapBuffers(): void;
    addPass(pass: any): void;
    insertPass(pass: any, index: any): void;
    isLastEnabledPass(passIndex: any): boolean;
    render(deltaTime?: number): void;
}
export { RenderFlow };
