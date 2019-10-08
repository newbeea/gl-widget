class Matrix3 {
  elements: Array<number>
  constructor() {
    this.elements = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ];
  }
  set ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
		te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
		te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;



	}
  setUvTransform ( tx, ty, sx, sy, rotation, cx, cy ) {

    var c = Math.cos( rotation );
    var s = Math.sin( rotation );

    this.set(
      sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
      - sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
      0, 0, 1
    );

  }
}
export { Matrix3 }