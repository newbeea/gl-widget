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
import { Skybox } from './Skybox';
import { RenderSide } from './Constants';
import { ShaderObject } from './Program';
import { RenderTarget } from './RenderTarget';
import { Vector2 } from './math/Vector2';

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
  renderTarget: RenderTarget;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext
  programs: Map<object, WebGLProgram>
  contextAttributes: ContextAttributes
  cameraMode: CAMERA
  defaultCamera: Camera
  pixelRatio: number;
  width: any;
  height: any;
  extensions: Extensions;
  opaqueList: Array<RenderableElement> = []
  transparentList: Array<RenderableElement> = []
  constructor(options: rendererOptions, attributes: ContextAttributes={}) {

    this.renderTarget = null
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
      this.width = element.clientWidth
      this.height = element.clientHeight
      this.setPixelRatio(window.devicePixelRatio)
      // this.setPixelRatio(1)
      // this.canvas.width = element.clientWidth
      // this.canvas.height = element.clientHeight
      // element.appendChild(this.canvas)
      let aspect = this.canvas.width / this.canvas.height
      this.defaultCamera = new PerspectiveCamera(50, aspect, 0.1, 1000) 
      this.defaultCamera.position.z = 10
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
    this.extensions = new Extensions(this.gl) // TODO
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
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
      this.opaqueList.forEach(element => {
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
  setRenderTarget (renderTarget: RenderTarget) {
    if (!renderTarget) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.renderTarget = null
    } else {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, renderTarget.frameBuffer);
      this.renderTarget = renderTarget
    }  
  }
  renderElement(element: RenderableElement, camera:Camera, shader?:ShaderObject) {
    let gl = this.gl

    // set depth test
    if(element.type == 'Background') {
      gl.disable(gl.DEPTH_TEST);
    } else {
      gl.enable(gl.DEPTH_TEST);

    }
    
    element.update(gl, shader)

    // set matrix

    let viewMatrix, modelViewMatrix, projectionMatrix, mvpMatrix;
    
    if (element instanceof Skybox) {
      let matrixWorldInverse = new Matrix4()
      matrixWorldInverse.extractRotation( camera.matrixWorld );
      matrixWorldInverse.getInverse( matrixWorldInverse );
      viewMatrix = matrixWorldInverse

    } else {
      viewMatrix = camera.matrixWorldInverse
      // mvpMatrix = pvMatrix.clone()
      // mvpMatrix.multiply(element.matrixWorld)
    }
    mvpMatrix = new Matrix4()
    projectionMatrix = camera.projectionMatrix
    modelViewMatrix = new Matrix4().multiplyMatrices(viewMatrix, element.matrixWorld)
    mvpMatrix.multiplyMatrices(camera.projectionMatrix, modelViewMatrix)

    var location = gl.getUniformLocation(element.glProgram, 'mvpMatrix');
    if (location != null) {
      gl.uniformMatrix4fv(location, false, mvpMatrix.elements)
    }

    location = gl.getUniformLocation(element.glProgram, 'modelViewMatrix');
    if (location != null) {
      gl.uniformMatrix4fv(location, false, modelViewMatrix.elements)
    }

    location = gl.getUniformLocation(element.glProgram, 'projectionMatrix');
    if (location != null) {
      gl.uniformMatrix4fv(location, false, projectionMatrix.elements)
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
    let mode = gl.TRIANGLES
    if (element.type == 'Points') {
      mode = gl.POINTS
    }
    if (element.hasIndex) {
      gl.drawElements(mode, element.vertexNum, gl.UNSIGNED_INT, 0)   
    } else {
      gl.drawArrays(mode, 0, element.vertexNum)
    }
    
  }

  getRenderTarget(): RenderTarget {
    return this.renderTarget
  }
  setPixelRatio ( value ) {

		if ( value === undefined ) return;

		this.pixelRatio = value;

		this.setSize( this.width, this.height, false );

	}
  getPixelRatio(): number {
    return this.pixelRatio
  } 
  setSize ( width, height, updateStyle ) {



		this.width = width;
		this.height = height;

		this.canvas.width = Math.floor( width * this.pixelRatio );
		this.canvas.height = Math.floor( height * this.pixelRatio );


    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';


		// this.setViewport( 0, 0, width, height );

	}
  getSize(): Vector2 {
    return new Vector2(this.width, this.height)
  }
  render(background?: RenderableElement, scene?: Object3D, camera?: Camera, once: boolean = false) {
    let gl = this.gl
    gl.clearColor(0.0, 0.0, 0.0, 0.0);  
    
    let renderFrame = () => {
   
       
      // let extensions = new Extensions(gl)
      
      this.opaqueList = []
      this.transparentList = []
      // parse render list
      if (background) {
        this.opaqueList.push(background)
      }
      
      if (scene) {
        scene.traverse((shape) => {
          if (shape.isRenderableElement){
            if (shape.transparent) {
              this.transparentList.push(shape)
            } else {
              this.opaqueList.push(shape)
            }
            
          }  
        })
      }
      
  
      camera = camera || this.defaultCamera
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      this.opaqueList.forEach((element: RenderableElement) => {
        this.renderElement(element, camera)  
      });

      this.transparentList.forEach((element: RenderableElement) => {
        this.renderElement(element, camera)  
      });
      
      // animate
      if(!once) {
        requestAnimationFrame(renderFrame)
      }
      

    }

    renderFrame()

    // TODO remove
    // this.setupMouse()
  }
}
export { Renderer, Background, Clock, Object3D };
