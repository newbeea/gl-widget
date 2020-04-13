import { GLWidget } from "./GLWidget";

class Pass {
  renderToScreen: boolean;
  clear: boolean;
  needsSwap: boolean;
  enabled: boolean;
  constructor() {
    // if set to true, the pass is processed by the composer
    this.enabled = true;

    // if set to true, the pass indicates to swap read and write buffer after rendering
    this.needsSwap = true;

    // if set to true, the pass clears its buffer before rendering
    this.clear = false;

    // if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
    this.renderToScreen = false;
  }
  setSize(width: number, height: number) {
  }
  render ( glWidget: GLWidget, writeBuffer, readBuffer, deltaTime, maskActive ) {
  }

}


export { Pass };