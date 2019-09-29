import { Background } from './Background';
import { Clock } from './Clock';
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
    this.canvas.width = 800
    this.canvas.height = 480
    let defaultAttributes: contextAttributes = {
      alpha: true,
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
  setupMouse(){
    let gl = this.gl
    let mouseEnter = {
      x: 0,
      y: 0
    }
    let mouseOld = {
      x: 0,
      y: 0
    }
    let mouseOffset = {
      x: 0,
      y: 0
    }

    let setMouseUniform = (x, y) => {
      this.programs.forEach(element => {
        var location = gl.getUniformLocation(element, 'mouse');
        if (location !== null) {
          gl.uniform2f(location, x, y)   
        }
      });
    }
    setMouseUniform(0, 1)

    let onMouseMove = (event: MouseEvent) => {
      mouseOffset.x = event.clientX - mouseEnter.x + mouseOld.x
      mouseOffset.y = event.clientY - mouseEnter.y + mouseOld.y
      setMouseUniform(mouseOffset.x / this.canvas.width, 1 - mouseOffset.y / this.canvas.height)
    }    
    this.canvas.addEventListener( 'mousemove', onMouseMove, false );
    this.canvas.addEventListener( 'mouseover', (event: MouseEvent) => {
      mouseEnter.x = event.clientX
      mouseEnter.y = event.clientY
    }, false );
    this.canvas.addEventListener( 'mouseout', (event: MouseEvent) => {
      mouseOld.x = mouseOffset.x
      mouseOld.y = mouseOffset.y
    }, false );
  }
  render(background?: Background) {
    let gl = this.gl
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    let extensions = new Extensions(gl)
    if(background) {
      background.setup(gl, this.canvas.width, this.canvas.height)
      let program = background.getProgram()
      this.programs.set(background, program)
    }
    
    this.setupMouse()

    let clock = new Clock()
    let animate = () => {
      //setup time uniform
      this.programs.forEach(element => {
        var location = gl.getUniformLocation(element, 'time');
        if (location !== null) {
          gl.uniform1f(location, clock.getElapsedTime())   
        }       
      });
      //draw
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
      requestAnimationFrame(animate)

    }
    // setTimeout(animate, 100)
    animate()

  }
}
export { Renderer, Background, Clock };
