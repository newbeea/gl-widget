import { Background } from './Background';
import { Clock } from './Clock';
import { Extensions } from './Extensions';

import { BufferManager } from './BufferManager';
import { PerspectiveCamera } from './cameras/PerspectiveCamera'
import { OrthographicCamera } from './cameras/OrthographicCamera'
import { Matrix4 } from './math/Matrix4';
import { RenderableElement } from './RenderableElement';

export enum CAMERA {
  PERSPECTIVE,
  ORTHOGRAPHIC
}
export interface rendererOptions {
  // canvas?: HTMLCanvasElement
  element: HTMLElement | HTMLCanvasElement | string
  gl?: WebGLRenderingContext
  cameraMode?: CAMERA
  
}
export interface ContextAttributes {
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
  renderList: Array<RenderableElement>
  contextAttributes: ContextAttributes
  cameraMode: CAMERA
  constructor(options: rendererOptions, attributes: ContextAttributes={}) {
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
      this.cameraMode = options.cameraMode || CAMERA.PERSPECTIVE
      element.insertBefore(this.canvas, element.firstChild)
    }
    
    let defaultAttributes: ContextAttributes = {
      alpha: true,
      depth: true,
      stencil: true,
      antialias: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true
    }
    this.contextAttributes = Object.assign(defaultAttributes, attributes)
    this.gl = options.gl 
    || <WebGLRenderingContext> this.canvas.getContext('webgl', this.contextAttributes)
    || <WebGLRenderingContext> this.canvas.getContext('experimental-webgl', this.contextAttributes)
    if (this.contextAttributes.depth) {
      this.gl.enable(this.gl.DEPTH_TEST);
    }
    this.programs = new Map()
  }
  setMatrixUniform(uniform, value) {

    this.renderList.forEach(element => {
      this.gl.useProgram(element.program)
      var location = this.gl.getUniformLocation(element.program, uniform);
      if (location != null) {
        this.gl.uniformMatrix4fv(location, false, value.elements)
      }
      
    });
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
  render(background?: RenderableElement, shape?: RenderableElement) {
    let gl = this.gl
    gl.clearColor(0.0, 0.0, 0.0, 0.0);   
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
    
    
    
    
    let frustumSize = 3
    let aspect = this.canvas.width / this.canvas.height
    let camera = this.cameraMode == CAMERA.PERSPECTIVE 
      ? new PerspectiveCamera(100, aspect, 0.1, 100) 
      : new OrthographicCamera(
        frustumSize * aspect / -2, 
        frustumSize * aspect / 2, 
        frustumSize / 2, 
        frustumSize / -2, 
        -1000, 
        1000)
    
    // let scale = new Matrix4()
    // scale.makeScale(1, 1, 1)
    // mvpMatrix.multiply(scale)
    // this.setMatrixUniform('mvpMatrix', mvpMatrix)

    let pvMatrix = new Matrix4()
    pvMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    let clock = new Clock()
    let animate = () => {
      //setup time uniform
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
      this.renderList.forEach((element: RenderableElement) => {
        bufferManager.updateBuffer(gl, element.program, element.geometry)
        gl.useProgram(element.program)


        var location = gl.getUniformLocation(element.program, 'time');
        if (location !== null) {
          gl.uniform1f(location, clock.getElapsedTime())   
        }    
        // element.updateMatrixWorld(true)
        let mvpMatrix = pvMatrix.clone()
        mvpMatrix.multiply(element.matrixWorld)
        

        var location = this.gl.getUniformLocation(element.program, 'mvpMatrix');
        if (location != null) {
          this.gl.uniformMatrix4fv(location, false, mvpMatrix.elements)
        }

        // console.log(element.vertexNum)
        if(element instanceof Background) {
          gl.disable(gl.DEPTH_TEST);
        } else if (this.contextAttributes.depth) {
          gl.enable(gl.DEPTH_TEST);
        }
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
