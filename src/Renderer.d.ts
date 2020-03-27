import { Background } from './Background';
import { Clock } from './Clock';
import { Extensions } from './Extensions';
import { RenderableElement } from './RenderableElement';
import { Object3D } from './Object3D';
import { Camera } from './cameras/Camera';
import { ShaderObject } from './Program';
import { RenderTarget } from './RenderTarget';
import { Vector2 } from './math/Vector2';
export declare enum CAMERA {
    PERSPECTIVE = 0,
    ORTHOGRAPHIC = 1
}
export interface rendererOptions {
    element: HTMLElement | HTMLCanvasElement | string;
    gl?: WebGLRenderingContext;
    cameraMode?: CAMERA;
}
export interface ContextAttributes {
    alpha?: boolean;
    depth?: boolean;
    stencil?: boolean;
    antialias?: boolean;
    premultipliedAlpha?: boolean;
    preserveDrawingBuffer?: boolean;
}
declare class Renderer {
    renderTarget: RenderTarget;
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    programs: Map<object, WebGLProgram>;
    contextAttributes: ContextAttributes;
    cameraMode: CAMERA;
    defaultCamera: Camera;
    pixelRatio: number;
    width: any;
    height: any;
    extensions: Extensions;
    opaqueList: Array<RenderableElement>;
    transparentList: Array<RenderableElement>;
    constructor(options: rendererOptions, attributes?: ContextAttributes);
    setupMouse(): void;
    setRenderTarget(renderTarget: RenderTarget): void;
    renderElement(element: RenderableElement, camera: Camera, shader?: ShaderObject): void;
    getRenderTarget(): RenderTarget;
    setPixelRatio(value: any): void;
    getPixelRatio(): number;
    setSize(width: any, height: any, updateStyle: any): void;
    getSize(): Vector2;
    render(background?: RenderableElement, scene?: Object3D, camera?: Camera, once?: boolean): void;
}
export { Renderer, Background, Clock, Object3D };
