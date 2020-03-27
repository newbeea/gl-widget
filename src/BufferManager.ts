import { BufferGeometry } from "./BufferGeometry";
import { Attribute } from "./Attribute";

class BufferManager {
  buffers: WeakMap<Attribute, WebGLBuffer>
  constructor() {
    this.buffers = new WeakMap()
  }
  initBuffer(gl: WebGLRenderingContext, program: WebGLProgram, geometry: BufferGeometry) {
    
    let count = 0
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
        // console.log('Failed to get the storage location of ' + name);
        // return -1;
      } else {
        gl.vertexAttribPointer(location, attribute.itemSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(location);
      }
      if (array.length) {
        count = array.length / attribute.itemSize
      }
      
      this.buffers.set(attribute, buffer)

    } 

    if (geometry.index) {
      let buffer = gl.createBuffer();
      if (!buffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.index.array, gl.STATIC_DRAW);
      this.buffers.set(geometry.index, buffer) 
      return {
        hasIndex: true,
        count: geometry.index.array.length
      }
    }
    return  {
      hasIndex: false,
      count: count
    }


  
  }
  bindBuffer(gl: WebGLRenderingContext, program: WebGLProgram, geometry: BufferGeometry) {

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.get(geometry.index))
    
    for(let [name, attribute] of geometry.attributes.entries()) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.get(attribute));
      let location = gl.getAttribLocation(program, name);
      if (location < 0) {
        // console.log('Failed to get the storage location of ' + name);
        // return -1;
      } else {
        gl.vertexAttribPointer(location, attribute.itemSize, gl.FLOAT, false, 0, 0);
      } 
    }
  }
}
export {
  BufferManager
} 