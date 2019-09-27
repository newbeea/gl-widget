import { Shader } from './Shader'
import { Program, ShaderObject } from './Program';
import { Clock } from './Clock'
export interface rendererOptions {
  canvas?: HTMLCanvasElement
  gl?: WebGLRenderingContext
}
export interface contextAttributes {
  alpha?: boolean,
  depth?: boolean,
  stencil?: boolean,
  antialias?: boolean,
  premultipliedAlpha?: boolean,
  preserveDrawingBuffer?: boolean
}
class Renderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext
  constructor(options: rendererOptions={}, attributes: contextAttributes={}) {
    this.canvas = options.canvas 
      || <HTMLCanvasElement> document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
    let defaultAttributes: contextAttributes = {
      alpha: false,
      depth: true,
      stencil: true,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false
    }
    attributes = Object.assign(defaultAttributes, attributes)
    this.gl = options.gl 
    || <WebGLRenderingContext> this.canvas.getContext('webgl', attributes)
    || <WebGLRenderingContext> this.canvas.getContext('experimental-webgl', attributes)
  }
  
  render() {
    let gl = this.gl
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
      var vertices = new Float32Array([
        -1.0, 1.0,   -1.0, -1.0,  1.0, 1.0,  
        1.0, 1.0,   -1.0, -1.0,   1.0, -1.0
      ]);
      var n = 4; // The number of vertices
    
      // Create a buffer object
      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    
      // Bind the buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      // Write date into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
      var a_Position = gl.getAttribLocation(program, 'a_Position');
      if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
      }
      // Assign the buffer object to a_Position variable
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_Position);

      var r = gl.getUniformLocation(program, 'iResolution')
      gl.uniform2f(r, 300, 150);

      
      return n;
    }
    
    let shader: ShaderObject = {
      
      vertexShader: `
        attribute vec4 a_Position;
        void main () {
          gl_Position = a_Position;
        }

      `,
      fragmentShader: `
       precision mediump float;
       uniform vec2 iResolution;
       uniform float     iTime; 
        void main () {
          // Normalized pixel coordinates (from 0 to 1)
          vec2 uv = gl_FragCoord.xy/iResolution.xy;
      
          // Time varying pixel color
          vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
      
          // // Output to screen
          // fragColor = vec4(col,1.0);


          gl_FragColor = vec4(col,1.0);
        }
      `
    }
    let program: Program = new Program(gl, shader)
    initVertexBuffers(gl, program.program)
    let clock = new Clock()
    function animate() {
      var time = gl.getUniformLocation(program.program, 'iTime');
      gl.uniform1f(time, clock.getElapsedTime())
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
      requestAnimationFrame(animate)
    }
    animate()

  }
}
export {
  Renderer
} 