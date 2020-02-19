
import { Vector3 } from './Vector3'
class Box3 {
  min: Vector3
  max: Vector3
  constructor(min?: Vector3, max?: Vector3) {
    this.min = ( min !== undefined ) ? min : new Vector3( + Infinity, + Infinity, + Infinity );
	  this.max = ( max !== undefined ) ? max : new Vector3( - Infinity, - Infinity, - Infinity );
  }
}

export { Box3 }