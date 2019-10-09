class Vector2 {
  x: number
  y: number
  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }
  add(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  sub(v: Vector2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  multiply(v: Vector2) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }
  multiplyScalar(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
  dot(v: Vector2) {
    return this.x * v.x + this.y * v.y;
  }
  clone() {
    return new Vector2(this.x, this.y);
  }
  copy(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  equals(v: Vector2) {
    return ((v.x === this.x) && (v.y === this.y));
  }
}
export { Vector2 }