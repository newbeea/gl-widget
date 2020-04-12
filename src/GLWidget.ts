import { Renderer } from "./Renderer"

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
class GLWidget {
  renderer: Renderer;
  renderTarget: RenderTarget;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext
  contextAttributes: ContextAttributes
  cameraMode: CAMERA
  camera: Camera
  pixelRatio: number;
  width: any;
  height: any;
  extensions: Extensions;
  opaqueList: Array<RenderableElement> = []
  transparentList: Array<RenderableElement> = []
  scene: Object3D;
  constructor(options: rendererOptions, attributes: ContextAttributes={}) {

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
      element.insertBefore(this.canvas, element.firstChild)
      this.canvas.width = element.clientWidth
      this.canvas.height = element.clientHeight
      this.width = element.clientWidth
      this.height = element.clientHeight
      this.setPixelRatio(window.devicePixelRatio)
      let aspect = this.canvas.width / this.canvas.height
      this.camera = new PerspectiveCamera(50, aspect, 0.1, 1000) 
      this.camera.position.z = 10
      
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
    this.extensions = new Extensions(this.gl) // TODO
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.scene = new Object3D()
    this.renderer = new Renderer(this.gl)
  }
  add (element: RenderableElement) {
    this.scene.add(element)
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

  getRenderTarget(): RenderTarget {
    return this.renderTarget
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

  setCamera() {

  }
  renderFrame () {
    this.opaqueList = []
    this.transparentList = []
    this.scene.traverse((shape) => {
      if (shape.isRenderableElement){
        if (shape.transparent) {
          this.transparentList.push(shape)
        } else {
          this.opaqueList.push(shape)
        }
        
      }  
    })
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.opaqueList.forEach((element: RenderableElement) => {
      this.renderer.renderElement(element, this.camera)  
    });
    this.transparentList.forEach((element: RenderableElement) => {
      this.renderer.renderElement(element, this.camera)  
    });
  }

  render(animation: Function) {

    let renderFrame = () => {  
      
      // animate
      if(animation) {
        animation()
      }
      this.renderFrame()
      requestAnimationFrame(renderFrame)
    }
    renderFrame()
    // TODO remove
    // this.setupMouse()
  }
}


export {
  GLWidget
}