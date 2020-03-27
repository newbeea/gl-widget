import { Pass } from "../../../Pass";
import { RenderableElement } from "../../../RenderableElement";
import { Renderer } from "../../../Renderer";
import { OrthographicCamera } from "../../../cameras/OrthographicCamera";
import { Texture } from "../../../Texture";
import { RenderTarget } from "../../../RenderTarget";
declare class ShaderPass extends Pass {
    camera: OrthographicCamera;
    textureID: string;
    uniforms: any;
    fullScreenQuad: RenderableElement;
    texture: Texture;
    h: WeakMap<any, any>;
    constructor(material: any, textureID?: string);
    render(renderer: Renderer, writeBuffer: RenderTarget, readBuffer: RenderTarget): void;
}
export { ShaderPass };
