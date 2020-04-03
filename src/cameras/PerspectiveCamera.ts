import { Matrix4 } from "../math/Matrix4"
import { Camera } from "./Camera"
import { CameraType } from "../Constants";

class PerspectiveCamera extends Camera {
  
  projectionMatrix: Matrix4
  fov: number;
  zoom: number;
  near: number;
  far: number;
  focus: number;
  aspect: number;
  // view: any;
  filmGauge: number;
  filmOffset: number;
  type: CameraType = CameraType.PERSPECTIVE
  constructor( fov, aspect, near, far ) {

    super();
    this.fov = fov !== undefined ? fov : 50;
    this.zoom = 1;

    this.near = near !== undefined ? near : 0.1;
    this.far = far !== undefined ? far : 2000;
    this.focus = 10;

    this.aspect = aspect !== undefined ? aspect : 1;
    // this.view = null;

    this.filmGauge = 35;	// width of the film (default in millimeters)
    this.filmOffset = 0;	// horizontal film offset (same unit as gauge)

    this.updateProjectionMatrix();
  }
  getFilmWidth () {

		// film not completely covered in portrait format (aspect < 1)
		return this.filmGauge * Math.min( this.aspect, 1 );

	}
  updateProjectionMatrix() {
    var near = this.near,
			top = near * Math.tan(
				Math.PI / 180 * 0.5 * this.fov ) / this.zoom,
			height = 2 * top,
			width = this.aspect * height,
			left = - 0.5 * width
		// 	view = this.view;

		// if ( this.view !== null && this.view.enabled ) {

		// 	var fullWidth = view.fullWidth,
		// 		fullHeight = view.fullHeight;

		// 	left += view.offsetX * width / fullWidth;
		// 	top -= view.offsetY * height / fullHeight;
		// 	width *= view.width / fullWidth;
		// 	height *= view.height / fullHeight;

		// }

		var skew = this.filmOffset;
		if ( skew !== 0 ) left += near * skew / this.getFilmWidth();
    this.projectionMatrix.makePerspective( left, left + width, top, top - height, near, this.far );
  }
}
export { PerspectiveCamera }