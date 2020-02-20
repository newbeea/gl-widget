import { Matrix4 } from "./math/Matrix4"
import { Vector3 } from "./math/Vector3";
import { Quaternion } from "./math/Quaternion";
import { RenderableElement } from "./RenderableElement";
class Object3D {
  matrix: Matrix4
  matrixWorldNeedsUpdate: boolean;
  matrixAutoUpdate: any;
  parent: Object3D;
  children: Array<Object3D>;
  matrixWorld: any;
  readonly position: Vector3;
  readonly quaternion: any;
  readonly scale: Vector3;
  changed: boolean;
  constructor () {
    this.changed = false
    this.matrix = new Matrix4()
    this.matrixWorld = new Matrix4()

    this.position = new Proxy(new Vector3(), {
      set: (target, key, value, receiver) => {
        let v = Reflect.set(target, key, value, receiver)
        this.updateMatrixWorld(true)
        return v
      }
    })
    this.quaternion = new Proxy(new Quaternion(), {
      set: (target, key, value, receiver) => {
        let v = Reflect.set(target, key, value, receiver)
        this.updateMatrixWorld(true)
        return v
      }
    })
    this.scale = new Proxy(new Vector3(1, 1, 1), {
      set: (target, key, value, receiver) => {
        let v = Reflect.set(target, key, value, receiver)
        this.updateMatrixWorld(true)
        return v
      }
    })
    this.parent = null
    this.children = []
    this.matrixAutoUpdate = true
  }
  applyMatrix ( matrix ) {
		this.matrix.multiplyMatrices( matrix, this.matrix );
		this.matrix.decompose( this.position, this.quaternion, this.scale );
  }
  
  updateMatrix () {
    this.changed = true
		this.matrix.compose( this.position, this.quaternion, this.scale );
		this.matrixWorldNeedsUpdate = true;

	}
  
  updateMatrixWorld ( force ) {

		if ( this.matrixAutoUpdate ) this.updateMatrix();

		if ( this.matrixWorldNeedsUpdate || force ) {

			if ( this.parent === null ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		var children = this.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].updateMatrixWorld( force );

		}

  }
  
  rotateOnAxis ( axis, angle ) {
    var q1 = new Quaternion();
    q1.setFromAxisAngle( axis, angle );

    this.quaternion.multiply( q1 );

    return this;

  }

	rotateOnWorldAxis ( axis, angle ) {
    var q1 = new Quaternion();
    q1.setFromAxisAngle( axis, angle );

    this.quaternion.premultiply( q1 );

    return this;

  }

	rotateX( angle ) {
    var v1 = new Vector3( 1, 0, 0 );
    return this.rotateOnAxis( v1, angle );

  }

	rotateY( angle ) {
    var v1 = new Vector3( 0, 1, 0 )
    return this.rotateOnAxis( v1, angle );

  }

	rotateZ( angle ) {
    var v1 = new Vector3( 0, 0, 1 )
    return this.rotateOnAxis( v1, angle );

  }

  add ( object: Object3D ) {


		if ( object ) {

			// if ( object.parent !== null ) {

			// 	object.parent.remove( object );

			// }

			object.parent = this;
			// object.dispatchEvent( { type: 'added' } );

			this.children.push( object );

		}

		return this;

	}
  traverse ( callback: Function ) {

		callback( this );

		var children = this.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].traverse( callback );

		}

	}
}
export {
  Object3D
} 