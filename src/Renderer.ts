import { Shader } from './Shader'
import { Program, ShaderObject } from './Program';
import { Clock } from './Clock'
import { BufferManager } from './BufferManager';
import { BackgroundGeometry } from './BackgroundGeometry';
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
        attribute vec4 a_Position;
        void main () {
          gl_Position = a_Position;
        }

      `,
      fragmentShader: `
       precision mediump float;
       uniform vec2 resolution;
       uniform float     time; 
        void main () {
          vec2 uv = gl_FragCoord.xy/resolution.xy;   
          vec3 col = 0.5 + 0.5*cos(time+uv.xyx+vec3(0,2,4));
          gl_FragColor = vec4(col,1.0);
        }
      `
    }
    let program: Program = new Program(gl, shader)
    let geometry = new BackgroundGeometry()
    //setup buffer and attribute
    let bufferManager = new BufferManager()
    bufferManager.initBuffer(gl, program.program, geometry)
    //setup uniform
    var r = gl.getUniformLocation(program.program, 'resolution')
    gl.uniform2f(r, 300, 150);

    let clock = new Clock()
    function animate() {
      var time = gl.getUniformLocation(program.program, 'time');
      gl.uniform1f(time, clock.getElapsedTime())
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
      requestAnimationFrame(animate)
    }
    animate()

  }
}
export {
  Renderer
} 