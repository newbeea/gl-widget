import { Camera, Vector2, Vector3, OrthographicCamera, PerspectiveCamera, Quaternion } from "@gl-widget/gl-widget";


import Spherical from "./Spherical";
let MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2 };
let TOUCH = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 };
let STATE = {
  NONE: - 1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
};
var EPS = 0.000001;
class OrbitControls {
  onMouseWheel: (event: any) => void;
  onMouseUp: (event: any) => void;
  onMouseMove: (event: any) => void;
  onMouseDown: (event: any) => void;
  lastQuaternion: any;
  lastPosition: Vector3;
  quatInverse: any;
  quat: any;
  offset: Vector3;
  enabled: boolean;
  state: number;
  dollyDelta: any;
  dollyEnd: any;
  dollyStart: any;
  rotateDelta: Vector2;
  rotateEnd: any;
  rotateStart: any;
  zoomChanged: boolean;
  panOffset: Vector3;
  scale: number;
  sphericalDelta: any;
  spherical: any;
  rotateSpeed: number;
  enableRotate: boolean;
  zoomSpeed: number;
  enableZoom: boolean;
  dampingFactor: number;
  enableDamping: boolean;
  maxAzimuthAngle: number;
  minAzimuthAngle: number;
  maxPolarAngle: number;
  minPolarAngle: number;
  maxZoom: number;
  minZoom: number;
  maxDistance: number;
  minDistance: number;
  target: Vector3;
  autoRotateSpeed: number;
  autoRotate: boolean;
  mouseButtons: { LEFT: number; MIDDLE: number; RIGHT: number; };
  camera: Camera;
  domElement: HTMLElement;
  constructor(camera: Camera, domElement) {
    this.camera = camera
    this.domElement = domElement
    this.enabled = true
    this.target = new Vector3();

    // How far you can dolly in and out ( PerspectiveCamera only )
    this.minDistance = 0;
    this.maxDistance = Infinity;

    // How far you can zoom in and out ( OrthographicCamera only )
    this.minZoom = 0;
    this.maxZoom = Infinity;

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    this.minAzimuthAngle = - Infinity; // radians
    this.maxAzimuthAngle = Infinity; // radians

    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    this.enableDamping = true;
    this.dampingFactor = 0.05;

    // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
    // Set to false to disable zooming
    this.enableZoom = true;
    this.zoomSpeed = 1.0;

    // Set to false to disable rotating
    this.enableRotate = true;
    this.rotateSpeed = 0.3;

    // Set to false to disable panning
    // this.enablePan = true;
    // this.panSpeed = 1.0;
    // this.screenSpacePanning = false; // if true, pan in screen-space
    // this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

    // Set to true to automatically rotate around the target
    // If auto-rotate is enabled, you must call controls.update() in your animation loop
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    // Set to false to disable use of the keys
    // this.enableKeys = true;

    // The four arrow keys
    // this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

    // Mouse buttons
    this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };

    // Touch fingers
    // this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };

    // for reset
    // this.target0 = this.target.clone();
    // this.position0 = this.object.position.clone();
    // this.zoom0 = this.object.zoom;


  
    this.state = STATE.NONE;
  
    
  
    // current position in spherical coordinates
    this.spherical = new Spherical();
    this.sphericalDelta = new Spherical();
  
    this.scale = 1;
    this.panOffset = new Vector3();
    this.zoomChanged = false;
  
    this.rotateStart = new Vector2();
    this.rotateEnd = new Vector2();
    this.rotateDelta = new Vector2();
  
    // this.panStart = new Vector2();
    // this.panEnd = new Vector2();
    // this.panDelta = new Vector2();
  
    this.dollyStart = new Vector2();
    this.dollyEnd = new Vector2();
    this.dollyDelta = new Vector2();


    this.offset = new Vector3();

		// so camera.up is the orbit axis
    this.quat = new Quaternion().setFromUnitVectors( this.camera.up, new Vector3( 0, 1, 0 ) );
    this.quatInverse = this.quat.clone().inverse();

    this.lastPosition = new Vector3();
    this.lastQuaternion = new Quaternion();
    this.onMouseDown = ( event ) => {

      if ( this.enabled === false ) return;
  
      // Prevent the browser from scrolling.
  
      event.preventDefault();
  
      // Manually set the focus since calling preventDefault above
      // prevents the browser from setting it automatically.
  
      // this.domElement.focus ? this.domElement.focus() : window.focus();
  
      switch ( event.button ) {
  
        case 0:
  
          switch ( this.mouseButtons.LEFT ) {
  
            case MOUSE.ROTATE:
  
              if ( event.ctrlKey || event.metaKey || event.shiftKey ) {
  
                // if ( this.enablePan === false ) return;
  
                // handleMouseDownPan( event );
  
                // state = STATE.PAN;
  
              } else {
  
                if ( this.enableRotate === false ) return;
  
                this.handleMouseDownRotate( event );
  
                this.state = STATE.ROTATE;
  
              }
  
              break;
  
            // case MOUSE.PAN:
  
            //   if ( event.ctrlKey || event.metaKey || event.shiftKey ) {
  
            //     if ( scope.enableRotate === false ) return;
  
            //     handleMouseDownRotate( event );
  
            //     state = STATE.ROTATE;
  
            //   } else {
  
            //     if ( scope.enablePan === false ) return;
  
            //     handleMouseDownPan( event );
  
            //     state = STATE.PAN;
  
            //   }
  
            //   break;
  
            default:
  
              this.state = STATE.NONE;
  
          }
  
          break;
  
  
        case 1:
  
          switch ( this.mouseButtons.MIDDLE ) {
  
            case MOUSE.DOLLY:
  
              if ( this.enableZoom === false ) return;
  
              this.handleMouseDownDolly( event );
  
              this.state = STATE.DOLLY;
  
              break;
  
  
            default:
  
              this.state = STATE.NONE;
  
          }
  
          break;
  
        case 2:
  
          switch ( this.mouseButtons.RIGHT ) {
  
            case MOUSE.ROTATE:
  
              if ( this.enableRotate === false ) return;
  
              this.handleMouseDownRotate( event );
  
              this.state = STATE.ROTATE;
  
              break;
  
            // case MOUSE.PAN:
  
            //   if ( this.enablePan === false ) return;
  
            //   this.handleMouseDownPan( event );
  
            //   this.state = STATE.PAN;
  
            //   break;
  
            default:
  
            this.state = STATE.NONE;
  
          }
  
          break;
  
      }
  
      if ( this.state !== STATE.NONE ) {
  
        document.addEventListener( 'mousemove', this.onMouseMove, false );
        document.addEventListener( 'mouseup', this.onMouseUp, false );
  
  
      }
    
      
    }
    this.onMouseMove = ( event ) => {

      if ( this.enabled === false ) return;
  
      event.preventDefault();
  
      switch ( this.state ) {
  
        case STATE.ROTATE:
  
          if ( this.enableRotate === false ) return;
  
          this.handleMouseMoveRotate( event );
  
          break;
  
        case STATE.DOLLY:
  
          if ( this.enableZoom === false ) return;
  
          this.handleMouseMoveDolly( event );
  
          break;
  
        // case STATE.PAN:
  
        // 	if ( scope.enablePan === false ) return;
  
        // 	handleMouseMovePan( event );
  
        // 	break;
  
      }
  
    }
  
    this.onMouseUp = ( event ) => {
  
      if ( this.enabled === false ) return;
  
      // this.handleMouseUp( event );
  
      document.removeEventListener( 'mousemove', this.onMouseMove, false );
      document.removeEventListener( 'mouseup', this.onMouseUp, false );
  
      this.state = STATE.NONE;
  
    }
  
    this.onMouseWheel = ( event ) => {

      if ( this.enabled === false || this.enableZoom === false || ( this.state !== STATE.NONE && this.state !== STATE.ROTATE ) ) return;
  
      event.preventDefault();
      event.stopPropagation();
      
      this.handleMouseWheel( event );
  
    }
    this.domElement.addEventListener( 'mousedown', this.onMouseDown, false );
	  this.domElement.addEventListener( 'wheel', this.onMouseWheel, false );

  }
  
  
  handleMouseDownRotate( event ) {

		this.rotateStart.set( event.clientX, event.clientY );

  }
  
  handleMouseDownDolly( event ) {

		this.dollyStart.set( event.clientX, event.clientY );

  }
  handleMouseMoveRotate( event ) {

		this.rotateEnd.set( event.clientX, event.clientY );

		this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart ).multiplyScalar( this.rotateSpeed );

		var element = this.domElement;

		this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / element.clientHeight ); // yes, height

		this.rotateUp( 2 * Math.PI * this.rotateDelta.y / element.clientHeight );

		this.rotateStart.copy( this.rotateEnd );

		// this.update();

	}

	handleMouseMoveDolly( event ) {

		this.dollyEnd.set( event.clientX, event.clientY );

		this.dollyDelta.subVectors( this.dollyEnd, this.dollyStart );

		if ( this.dollyDelta.y > 0 ) {

			this.dollyIn( this.getZoomScale() );

		} else if ( this.dollyDelta.y < 0 ) {

			this.dollyOut( this.getZoomScale() );

		}

		this.dollyStart.copy( this.dollyEnd );

		// this.update();

  }
  handleMouseWheel( event ) {

		if ( event.deltaY < 0 ) {

			this.dollyOut( this.getZoomScale() );

		} else if ( event.deltaY > 0 ) {

			this.dollyIn( this.getZoomScale() );

		}

		this.update();

  }
  rotateLeft( angle ) {

		this.sphericalDelta.theta -= angle;

  }
  rotateUp( angle ) {

		this.sphericalDelta.phi -= angle;

  }
  dollyIn( dollyScale ) {

		if ( this.camera.isPerspective ) {

			this.scale /= dollyScale;

		} else if ( this.camera.isOrthographic ) {

			this.camera.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.camera.zoom * dollyScale ) );
			this.camera.updateProjectionMatrix();
			this.zoomChanged = true;

		} else {

			this.enableZoom = false;

		}

	}

	dollyOut( dollyScale ) {

    if ( this.camera.isPerspective ) {

			this.scale *= dollyScale;

    } else if (this.camera.isOrthographic) {

			this.camera.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.camera.zoom / dollyScale ) );
			this.camera.updateProjectionMatrix();
			this.zoomChanged = true;

		} else {

			this.enableZoom = false;

		}

  }
  getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;

	}

	getZoomScale() {

		return Math.pow( 0.95, this.zoomSpeed );

  }
    
  update () {
    var position = this.camera.position;

    this.offset.copy( position ).sub( this.target );

    // rotate offset to "y-axis-is-up" space
    this.offset.applyQuaternion( this.quat );

    // angle from z-axis around y-axis
    this.spherical.setFromVector3( this.offset );

    if ( this.autoRotate && this.state === STATE.NONE ) {

      this.rotateLeft( this.getAutoRotationAngle() );

    }

    if ( this.enableDamping ) {

      this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor;
      this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor;

    } else {

      this.spherical.theta += this.sphericalDelta.theta;
      this.spherical.phi += this.sphericalDelta.phi;

    }

    // restrict theta to be between desired limits
    this.spherical.theta = Math.max( this.minAzimuthAngle, Math.min( this.maxAzimuthAngle, this.spherical.theta ) );

    // restrict phi to be between desired limits
    this.spherical.phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, this.spherical.phi ) );

    this.spherical.makeSafe();


    this.spherical.radius *= this.scale;

    // restrict radius to be between desired limits
    this.spherical.radius = Math.max( this.minDistance, Math.min( this.maxDistance, this.spherical.radius ) );

    // move target to panned location

    if ( this.enableDamping === true ) {

      this.target.addScaledVector( this.panOffset, this.dampingFactor );

    } else {

      this.target.add( this.panOffset );

    }

    this.offset.setFromSpherical( this.spherical );

    // rotate offset back to "camera-up-vector-is-up" space
    this.offset.applyQuaternion( this.quatInverse );

    position.copy( this.target ).add( this.offset );

    this.camera.lookTarget( this.target );

    if ( this.enableDamping === true ) {

      this.sphericalDelta.theta *= ( 1 - this.dampingFactor );
      this.sphericalDelta.phi *= ( 1 - this.dampingFactor );

      this.panOffset.multiplyScalar( 1 - this.dampingFactor );

    } else {

      this.sphericalDelta.set( 0, 0, 0 );

      this.panOffset.set( 0, 0, 0 );

    }

    this.scale = 1;

    // update condition is:
    // min(camera displacement, camera rotation in radians)^2 > EPS
    // using small-angle approximation cos(x/2) = 1 - x^2 / 8

    if ( this.zoomChanged ||
      this.lastPosition.distanceToSquared( this.camera.position ) > EPS ||
      8 * ( 1 - this.lastQuaternion.dot( this.camera.quaternion ) ) > EPS ) {

      this.lastPosition.copy( this.camera.position );
      this.lastQuaternion.copy( this.camera.quaternion );
      this.zoomChanged = false;

      return true;

    }

    return false;



	}

}
export default OrbitControls