export enum RenderSide {
  FRONT,
  BACK,
  DOUBLE
}
export enum CameraType {
  PERSPECTIVE,
  ORTHOGRAPHIC
}
export enum Encoding {
  LinearEncoding,
  sRGBEncoding,
  RGBEEncoding,
  RGBM7Encoding,
  RGBM16Encoding,
  RGBDEncoding,
  GammaEncoding,
  LogLuvEncoding
}


// Mapping modes
export enum Mapping {
  UVMapping,
  CubeReflectionMapping,
  CubeRefractionMapping,
  EquirectangularReflectionMapping,
  SphericalReflectionMapping,
  CubeUVReflectionMapping,
  CubeUVRefractionMapping
}

// Wrapping modes
export enum Wrapping {
  RepeatWrapping,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping
}

// Filters
export enum TextureFilter {
  NearestFilter,
  NearestMipmapNearestFilter,
  NearestMipmapLinearFilter,
  LinearFilter,
  LinearMipmapNearestFilter,
  LinearMipmapLinearFilter

}

// Data types
export enum TextureDataType {
  UnsignedByteType,
  ByteType,
  ShortType,
  UnsignedShortType,
  IntType,
  UnsignedIntType,
  FloatType,
  HalfFloatType
}

// Pixel types
export enum PixelType {
  UnsignedShort4444Type,
  UnsignedShort5551Type,
  UnsignedShort565Type,
  UnsignedInt248Type
}

// Pixel formats
export enum PixelFormat {
  AlphaFormat,
  RGBFormat,
  RGBAFormat,
  LuminanceFormat,
  LuminanceAlphaFormat,
  RGBEFormat,
  DepthFormat,
  DepthStencilFormat,
  RedFormat
}
