import { Shader } from './Shader'
import { Program, ShaderObject } from './Program';
import { Clock } from './Clock'
import { BufferManager } from './BufferManager';
import { BackgroundGeometry } from './BackgroundGeometry';
import { Background } from './Background';
import { Extensions } from './Extensions';
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
  programs: Map<object, WebGLProgram>
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
    this.programs = new Map()
  }
  setUniform(key, uniform, value) {
    let program = this.programs.get(key)
    var location = this.gl.getUniformLocation(program, uniform);
    this.gl.uniform1f(location, value)
  }
  render(background?: Background) {
    let gl = this.gl
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    let extensions = new Extensions(gl)
    if(background) {
      background.setup(gl, this.canvas.width, this.canvas.height)
      let program = background.getProgram()
      this.programs.set(background, program)
    }

    let clock = new Clock()
    let animate = () => {
      //setup time uniform
      this.programs.forEach(element => {
        var time = gl.getUniformLocation(element, 'time');
        if (time !== null) {
          gl.uniform1f(time, clock.getElapsedTime())   
        }
        
      });
      //draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
      requestAnimationFrame(animate)
    }
    animate()

  }
}
export {
  Renderer,
  Background,
  Clock
} 