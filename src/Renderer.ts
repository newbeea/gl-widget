import { Background } from './Background';
import { Clock } from './Clock';
import { Extensions } from './Extensions';
import { Shape } from './extras/plugins/Shape';
import { BufferManager } from './BufferManager';
import { RenderedObject } from './RenderedObject';

export interface rendererOptions {
  // canvas?: HTMLCanvasElement
  element: HTMLElement | HTMLCanvasElement | string
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
  renderList: Array<RenderedObject>
  constructor(options: rendererOptions, attributes: contextAttributes={}) {
    this.renderList = []
    if (options.element instanceof HTMLCanvasElement) {
      this.canvas = options.element
    } else {
      let element: HTMLElement
      this.canvas = <HTMLCanvasElement> document.createElement('canvas')
        
      if (options.element instanceof HTMLElement){
        element = options.element
      } else {
        element = document.getElementById(options.element)
        if(!element) {
          console.error(options.element + ' not found!')
        }
      }
      // this.canvas.style.position = 'absolute'
      // this.canvas.style.top = '0'
      // this.canvas.style.left = '0'
      this.canvas.width = element.clientWidth
      this.canvas.height = element.clientHeight
      // element.appendChild(this.canvas)
      element.insertBefore(this.canvas, element.firstChild)
    }
    
    let defaultAttributes: contextAttributes = {
      alpha: true,
      depth: true,
      stencil: true,
      antialias: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true
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
      this.renderList.forEach(element => {
        gl.useProgram(element.program)
        var location = gl.getUniformLocation(element.program, 'mouse');
        if (location != null) {
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
  render(background?: RenderedObject, shape?: RenderedObject) {
    let gl = this.gl
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    let bufferManager = new BufferManager()
    let extensions = new Extensions(gl)
    
    if (background) {
      this.renderList.push(background)
      background.setup(gl, bufferManager, this.canvas.width, this.canvas.height)
    }
    
    if (shape) {
      this.renderList.push(shape)
      shape.setup(gl, bufferManager, this.canvas.width, this.canvas.height)
    }
    
    
    

    

    let clock = new Clock()
    let animate = () => {
      //setup time uniform
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
      this.renderList.forEach((element: RenderedObject) => {
        bufferManager.updateBuffer(gl, element.program, element.geometry)
        gl.useProgram(element.program)
        var location = gl.getUniformLocation(element.program, 'time');
        if (location !== null) {
          gl.uniform1f(location, clock.getElapsedTime())   
        }    
        // console.log(element.vertexNum)
        gl.drawElements(gl.TRIANGLES, element.vertexNum, gl.UNSIGNED_INT, 0)
      });
      //draw    
      requestAnimationFrame(animate)

    }
    // setTimeout(animate, 100)
    animate()
    this.setupMouse()
  }
}
export { Renderer, Background, Clock };
