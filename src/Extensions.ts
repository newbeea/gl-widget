
class Extensions {

	extensions: object;
  gl: WebGLRenderingContext
  constructor( gl: WebGLRenderingContext) {
    this.extensions = {}
    this.gl = gl

    this.get( 'WEBGL_depth_texture' );
		this.get( 'OES_texture_float' );
		this.get( 'OES_texture_float_linear' );
		this.get( 'OES_texture_half_float' );
		this.get( 'OES_texture_half_float_linear' );
    this.get( 'OES_standard_derivatives' );
    this.get( 'OES_element_index_uint' );
		this.get( 'EXT_shader_texture_lod' );
		this.get( 'ANGLE_instanced_arrays' );
  }

  get ( name ): object {
    let gl = this.gl
    if ( this.extensions[ name ] !== undefined ) {

      return this.extensions[ name ];

    }

    var extension;

    switch ( name ) {

      case 'WEBGL_depth_texture':
        extension = gl.getExtension( 'WEBGL_depth_texture' ) || gl.getExtension( 'MOZ_WEBGL_depth_texture' ) || gl.getExtension( 'WEBKIT_WEBGL_depth_texture' );
        break;

      case 'EXT_texture_filter_anisotropic':
        extension = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
        break;

      case 'WEBGL_compressed_texture_s3tc':
        extension = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
        break;

      case 'WEBGL_compressed_texture_pvrtc':
        extension = gl.getExtension( 'WEBGL_compressed_texture_pvrtc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
        break;

      case 'WEBGL_compressed_texture_etc1':
        extension = gl.getExtension( 'WEBGL_compressed_texture_etc1' );
        break;

      default:
        extension = gl.getExtension( name );

    }

    if ( extension === null ) {

      console.warn( 'THREE.WebGLRenderer: ' + name + ' extension not supported.' );

    }

    this.extensions[ name ] = extension;

    return extension;

  }

}


export { Extensions };
