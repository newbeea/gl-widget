declare class Pass {
    renderToScreen: boolean;
    clear: boolean;
    needsSwap: boolean;
    enabled: boolean;
    constructor();
    setSize(width: number, height: number): void;
    render(renderer: any, writeBuffer: any, readBuffer: any, deltaTime: any, maskActive: any): void;
}
export { Pass };
