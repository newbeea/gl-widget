import { Geometry } from "./Geometry";

class BufferManager {
  constructor() {
  }
  initBuffer(gl: WebGLRenderingContext, program: WebGLProgram, geometry: Geometry) {
    for(let name of geometry.attributes.values()) {
      var array = name.array
      var buffer = gl.createBuffer();
      if (!buffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
      var location = gl.getAttribLocation(program, 'a_Position');
      if (location < 0) {
        console.log('Failed to get the storage location of ' + name);
        return -1;
      }
      gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(location);
    }
  }
}
export {
  BufferManager
} 