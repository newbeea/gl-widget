
import { Vector2 } from './Vector2'
class Box2 {
  min: Vector2
  max: Vector2
  constructor(min?: Vector2, max?: Vector2) {
    this.min = ( min !== undefined ) ? min : new Vector2( + Infinity, + Infinity );
	  this.max = ( max !== undefined ) ? max : new Vector2( - Infinity, - Infinity );
  }
}

export { Box2 }