

class Attribute {
  array: Uint32Array | Float32Array
  itemSize: number
  normalized: boolean
  constructor(itemSize: number, normalized: boolean = false) {
    this.itemSize = itemSize
    this.normalized = normalized
  }

  setXY ( index, x, y ): Attribute {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;

		return this;

	}

	setXYZ ( index, x, y, z ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;

		return this;

	}

}
export {
  Attribute
} 