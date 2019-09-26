export interface rendererOptions {
  canvas?: HTMLCanvasElement
  context?: CanvasRenderingContext2D | WebGLRenderingContext
}
export interface contextAttributes {
  alpha?: boolean,
  depth?: boolean,
  stencil?: boolean,
  antialias?: boolean,
  premultipliedAlpha?: boolean,
  preserveDrawingBuffer?: boolean
}
class Renderer {
  canvas: HTMLCanvasElement;
  context: any;
  constructor(options: rendererOptions={}, attributes: contextAttributes={}) {
    this.canvas = options.canvas 
      || <HTMLCanvasElement> document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
    let defaultAttributes: contextAttributes = {
      alpha: false,
      depth: true,
      stencil: true,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false
    }
    attributes = Object.assign(defaultAttributes, attributes)
    this.context = options.context 
      || this.canvas.getContext('webgl', attributes)
      || this.canvas.getContext('experimental-webgl', attributes)
  }
  render() {
    console.log('rendering')
  }
}
export {
  Renderer
} 