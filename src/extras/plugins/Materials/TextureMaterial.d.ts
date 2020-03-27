import { RenderSide } from "../../../Constants";
import { Texture } from "../../../Texture";
declare class TextureMaterial {
    vertexShader: string;
    fragmentShader: string;
    uniforms: any;
    side: RenderSide;
    transparent: boolean;
    constructor(tDiffuse?: Texture);
}
export default TextureMaterial;
