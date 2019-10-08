import { Geometry } from "./Geometry";
import { Attribute } from "./Attribute";

class BufferManager {
  buffers: WeakMap<Attribute, WebGLBuffer>
  constructor() {
    this.buffers = new WeakMap()
  }
  initBuffer(gl: WebGLRenderingContext, program: WebGLProgram, geometry: Geometry) {
    
    for(let [name, attribute] of geometry.attributes.entries()) {
      let array = attribute.array
      let buffer = gl.createBuffer();
      if (!buffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
      let location = gl.getAttribLocation(program, name);
      if (location < 0) {
        console.log('Failed to get the storage location of ' + name);
        return -1;
      } else {
        gl.vertexAttribPointer(location, attribute.itemSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(location);
      }

      this.buffers.set(attribute, buffer)

    }
    var vertexNum = 0
    let buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.index.array, gl.STATIC_DRAW);
    this.buffers.set(geometry.index, buffer) 

    return geometry.index.array.length
  
  }
  updateBuffer(gl: WebGLRenderingContext, program: WebGLProgram, geometry: Geometry) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.get(geometry.index))
    
    for(let [name, attribute] of geometry.attributes.entries()) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.get(attribute));
      let location = gl.getAttribLocation(program, name);
      if (location < 0) {
        console.log('Failed to get the storage location of ' + name);
        return -1;
      } else {
        gl.vertexAttribPointer(location, attribute.itemSize, gl.FLOAT, false, 0, 0);
      } 
    }
  }
}
export {
  BufferManager
} 