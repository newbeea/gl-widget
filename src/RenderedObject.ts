

import { Geometry } from "./Geometry";
import { BufferManager } from "./BufferManager";
class RenderedObject {
  program: WebGLProgram
  vertexNum: number
  geometry: Geometry

  getProgram(): WebGLProgram {
    return this.program
  }
  setup(gl: WebGLRenderingContext, bufferManager: BufferManager, width: number, height: number) {}
}
export {
  RenderedObject
} 