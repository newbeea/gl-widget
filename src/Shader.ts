class Shader {
  constructor(gl: WebGLRenderingContext, type: number, glslString: string) {
    let shader: WebGLShader = gl.createShader(type)
    gl.shaderSource(shader, glslString)
    gl.compileShader(shader)
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
      console.error('THREE.WebGLShader: Shader couldn\'t compile.')
    }
    if (gl.getShaderInfoLog(shader) !== '') {
      console.warn('THREE.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader);
    }
    return shader
  }
}
export {
  Shader
} 