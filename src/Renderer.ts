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
import { RenderSide, CameraType } from './Constants';
import { ShaderObject } from './Program';
import { RenderTarget } from './RenderTarget';
import { Matrix3 } from './math/index';


export interface rendererOptions {
  // canvas?: HTMLCanvasElement
  element: HTMLElement | HTMLCanvasElement | string
  gl?: WebGLRenderingContext
  cameraMode?: CameraType
  
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
  defaultCamera: Camera
  pixelRatio: number;
  width: any;
  height: any;
  extensions: Extensions;
  opaqueList: Array<RenderableElement> = []
  transparentList: Array<RenderableElement> = []
  constructor(gl: WebGLRenderingContext) {

    this.gl = gl
   
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

    let normalMatrix = new Matrix3()
    normalMatrix.getNormalMatrix( modelViewMatrix );
    element.shader.uniforms['mvpMatrix'].value = mvpMatrix
    element.shader.uniforms['modelMatrix'].value = element.matrixWorld
    element.shader.uniforms['modelViewMatrix'].value = modelViewMatrix
    element.shader.uniforms['viewMatrix'].value = viewMatrix
    element.shader.uniforms['projectionMatrix'].value = projectionMatrix
    element.shader.uniforms['cameraPosition'].value = camera.position
    element.shader.uniforms['isOrthographic'].value = camera.type == CameraType.ORTHOGRAPHIC
    element.shader.uniforms['normalMatrix'].value = normalMatrix
    

    // set render side
    switch (element.shader.side) {
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
      default:
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK)
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

  
}
export { Renderer };
