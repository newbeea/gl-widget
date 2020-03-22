class Vector3 {
  x: number
  y: number
  z: number
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }
  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z
    return this;
  }
  add(v: Vector3) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  sub(v: Vector3) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  subVectors (a, b) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

  }
  fromArray (array, offset) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];

		return this;

	}
  setFromMatrixColumn (m, index) {

		return this.fromArray( m.elements, index * 4 );

	}
  lengthSq () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	}
  multiply(v: Vector3) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }
  multiplyScalar(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }
  dot(v: Vector3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  copy(v: Vector3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  equals(v: Vector3) {
    return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
  }
  length () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

  }
  crossVectors ( a, b ) {

		var ax = a.x, ay = a.y, az = a.z;
		var bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;

  }
  divideScalar ( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	}
  normalize () {

		return this.divideScalar( this.length() );

  }
  
  applyQuaternion ( q ) {
		var x = this.x, y = this.y, z = this.z;
		var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

		// calculate quat * vector

		var ix = qw * x + qy * z - qz * y;
		var iy = qw * y + qz * x - qx * z;
		var iz = qw * z + qx * y - qy * x;
		var iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

  }
  addScaledVector ( v, s ) {

		this.x += v.x * s;
		this.y += v.y * s;
		this.z += v.z * s;

		return this;

  }
  
  setFromSpherical ( s ) {

		return this.setFromSphericalCoords( s.radius, s.phi, s.theta );

  }
  
	setFromSphericalCoords ( radius, phi, theta ) {

		var sinPhiRadius = Math.sin( phi ) * radius;

		this.x = sinPhiRadius * Math.sin( theta );
		this.y = Math.cos( phi ) * radius;
		this.z = sinPhiRadius * Math.cos( theta );

		return this;

  }
  
  distanceTo ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	}

	distanceToSquared ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

  }
 
}
export { Vector3 }