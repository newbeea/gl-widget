import { Shader } from './Shader'
import { Program, ShaderObject } from './Program';

export interface rendererOptions {
  canvas?: HTMLCanvasElement
  gl?: WebGLRenderingContext
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
  gl: WebGLRenderingContext
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
    this.gl = options.gl 
    || <WebGLRenderingContext> this.canvas.getContext('webgl', attributes)
    || <WebGLRenderingContext> this.canvas.getContext('experimental-webgl', attributes)
  }
  render() {
    let gl = this.gl
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let shader: ShaderObject = {
      vertexShader: `
        void main () {
          gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
          gl_PointSize = 10.0;
        }

      `,
      fragmentShader: `
        void main () {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `
    }
    new Program(gl, shader)
    gl.drawArrays(gl.POINTS, 0, 1)


  }
}
export {
  Renderer
} 