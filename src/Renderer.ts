import { Background } from './Background';
import { Clock } from './Clock';
import { Extensions } from './Extensions';

import { BufferManager } from './BufferManager';
import { PerspectiveCamera } from './cameras/PerspectiveCamera'
import { OrthographicCamera } from './cameras/OrthographicCamera'
import { Matrix4 } from './math/Matrix4';
import { RenderableElement } from './RenderableElement';
import { Object3D } from './Object3D';
import { Vector3 } from './math/Vector3';
import { Camera } from './cameras/Camera';
import { SkyBox } from './SkyBox';
import { RenderSide } from './Constants';

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
  defaultCamera: Camera
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
      let aspect = this.canvas.width / this.canvas.height
      this.defaultCamera = new PerspectiveCamera(50, aspect, 0.1, 1000) 
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
        gl.useProgram(element.glProgram)
        var location = gl.getUniformLocation(element.glProgram, 'mouse');
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
  render(background?: RenderableElement, scene?: Object3D, camera?: Camera) {
    let gl = this.gl
    gl.clearColor(0.0, 0.0, 0.0, 0.0);   
    let bufferManager = new BufferManager()
    let extensions = new Extensions(gl)
    

    // parse render list
    if (background) {
      this.renderList.push(background)
    }
    
    if (scene) {
      scene.traverse((shape) => {
        if (shape instanceof RenderableElement){
          this.renderList.push(shape)
        }  
      })
    }
    
    
    
    
    // let frustumSize = 3
    
    // let camera = this.cameraMode == CAMERA.PERSPECTIVE 
    //   ? new PerspectiveCamera(20, aspect, 0.1, 100) 
    //   : new OrthographicCamera(
    //     frustumSize * aspect / -2, 
    //     frustumSize * aspect / 2, 
    //     frustumSize / 2, 
    //     frustumSize / -2, 
    //     -1000, 
    //     1000)
    // camera.position.x = 10 

    // camera = camera || new PerspectiveCamera(50, aspect, 0.1, 100) 
    
    camera = camera || this.defaultCamera
    // let scale = new Matrix4()
    // scale.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, -1), new Vector3(0, 1, 0))
    // console.log(scale.elements[0], scale.elements[4], scale.elements[8], scale.elements[12])
    // console.log(scale.elements[1], scale.elements[5], scale.elements[9], scale.elements[13])
    // console.log(scale.elements[2], scale.elements[6], scale.elements[10], scale.elements[14])
    // console.log(scale.elements[3], scale.elements[7], scale.elements[11], scale.elements[15])
    // scale.makeScale(1, 1, 1)
    // mvpMatrix.multiply(scale)
    // this.setMatrixUniform('mvpMatrix', mvpMatrix)
    let skyboxCamera
    let clock = new Clock()
    let animate = () => {
   
      let pvMatrix = new Matrix4()
      pvMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      this.renderList.forEach((element: RenderableElement) => {
      
        
        element.update(gl)

        // set matrix
        let mvpMatrix
        if (element instanceof SkyBox) {
          let matrixWorldInverse = new Matrix4()
          matrixWorldInverse.extractRotation( camera.matrixWorld );
          matrixWorldInverse.getInverse( matrixWorldInverse );
          mvpMatrix = new Matrix4()
          mvpMatrix.multiplyMatrices(camera.projectionMatrix, matrixWorldInverse)
          mvpMatrix.multiply(element.matrixWorld)
        } else {
          mvpMatrix = pvMatrix.clone()
          mvpMatrix.multiply(element.matrixWorld)
        }

        var location = gl.getUniformLocation(element.glProgram, 'mvpMatrix');
        if (location != null) {
          gl.uniformMatrix4fv(location, false, mvpMatrix.elements)
        }
     
        // set render side
        switch (element.side) {
          case RenderSide.FRONT:
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK)
            break
          case RenderSide.BACK:
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.FRONT)
            break
          case RenderSide.DOUBLE:
            gl.disable(gl.CULL_FACE);
            break
        }

        // set depth test
        if(element instanceof Background) {
          gl.disable(gl.DEPTH_TEST);
        } else if (this.contextAttributes.depth) {
          gl.enable(gl.DEPTH_TEST);
        }
        
        //draw    
        gl.drawElements(gl.TRIANGLES, element.vertexNum, gl.UNSIGNED_INT, 0)
      });
      
      // animate
      requestAnimationFrame(animate)

    }

    animate()

    // TODO remove
    this.setupMouse()
  }
}
export { Renderer, Background, Clock, Object3D };
