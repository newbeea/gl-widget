class WebGL {
  static webGL: WebGL
  
  gl: WebGLRenderingContext
  emptyTextures: any
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
    this.emptyTextures = []
    this.emptyTextures[ gl.TEXTURE_2D ] = this.createTexture( gl.TEXTURE_2D, gl.TEXTURE_2D, 1 );
	  this.emptyTextures[ gl.TEXTURE_CUBE_MAP ] = this.createTexture( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6 );
  }
  getEmptyTexture(type) {
    return this.emptyTextures[ type ]
  }
  createTexture( type, target, count ) {
    let gl = this.gl
		var data = new Uint8Array( 4 ); // 4 is required to match default unpack alignment of 4.
		var texture = gl.createTexture();

		gl.bindTexture( type, texture );
		gl.texParameteri( type, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
		gl.texParameteri( type, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

		for ( var i = 0; i < count; i ++ ) {

			gl.texImage2D( target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data );

		}

		return texture;

	}
  static getInstance(gl) {
    if (!WebGL.webGL) {
      WebGL.webGL = new WebGL(gl)
      return WebGL.webGL
    } else {
      return WebGL.webGL
    }
  }
}
export default WebGL