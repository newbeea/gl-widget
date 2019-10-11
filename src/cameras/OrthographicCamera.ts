import { Camera } from "./Camera";

class OrthographicCamera extends Camera {
  zoom: number;
  left: any;
  right: any;
  top: any;
  bottom: any;
  near: any;
  far: any;
  updateProjectionMatrix() {
    var dx = ( this.right - this.left ) / ( 2 * this.zoom );
		var dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
		var cx = ( this.right + this.left ) / 2;
		var cy = ( this.top + this.bottom ) / 2;

		var left = cx - dx;
		var right = cx + dx;
		var top = cy + dy;
		var bottom = cy - dy;

	

		this.projectionMatrix.makeOrthographic( left, right, top, bottom, this.near, this.far );
  }

	constructor ( left, right, top, bottom, near, far ) {


    super();
    this.zoom = 1;

    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;

    this.near = ( near !== undefined ) ? near : 0.1;
    this.far = ( far !== undefined ) ? far : 2000;

    this.updateProjectionMatrix();

  }

}


export { OrthographicCamera };
