import { Curve } from './Curve';
import { Vector2 } from '../../../math/Vector2'
// import * as Curves from '../curves/Curves.js';
import { LineCurve } from './LineCurve';
import { CubicBezierCurve } from './CubicBezierCurve'
import { QuadraticBezierCurve } from './QuadraticBezierCurve'
import { EllipseCurve } from './EllipseCurve';

function Path(points?) {

	Curve.call( this );

	this.type = 'Path';

	this.curves = [];
  this.autoClose = false; // Automatically closes the path
  this.currentPoint = new Vector2();

	if ( points ) {

		this.setFromPoints( points );

	}

}

Path.prototype = Object.assign( Object.create( Curve.prototype ), {

	constructor: Path,

	add: function ( curve ) {

		this.curves.push( curve );

	},

	closePath: function () {

		// Add a line curve if start and end of lines are not connected
		var startPoint = this.curves[ 0 ].getPoint( 0 );
		var endPoint = this.curves[ this.curves.length - 1 ].getPoint( 1 );

		if ( ! startPoint.equals( endPoint ) ) {
      // TODO
			// this.curves.push( new Curves[ 'LineCurve' ]( endPoint, startPoint ) );

		}

	},
  setFromPoints: function ( points ) {

		this.moveTo( points[ 0 ].x, points[ 0 ].y );

		for ( var i = 1, l = points.length; i < l; i ++ ) {

			this.lineTo( points[ i ].x, points[ i ].y );

		}

	},

	moveTo: function ( x, y ) {

		this.currentPoint.set( x, y ); // TODO consider referencing vectors instead of copying?

	},

	lineTo: function ( x, y ) {

		var curve = new LineCurve( this.currentPoint.clone(), new Vector2( x, y ) );
		this.curves.push( curve );

		this.currentPoint.set( x, y );

	},

	quadraticCurveTo: function ( aCPx, aCPy, aX, aY ) {

		var curve = new QuadraticBezierCurve(
			this.currentPoint.clone(),
			new Vector2( aCPx, aCPy ),
			new Vector2( aX, aY )
		);

		this.curves.push( curve );

		this.currentPoint.set( aX, aY );

	},

	bezierCurveTo: function ( aCP1x, aCP1y, aCP2x, aCP2y, aX, aY ) {

		var curve = new CubicBezierCurve(
			this.currentPoint.clone(),
			new Vector2( aCP1x, aCP1y ),
			new Vector2( aCP2x, aCP2y ),
			new Vector2( aX, aY )
		);

		this.curves.push( curve );

		this.currentPoint.set( aX, aY );

	},

	absellipse: function ( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation ) {

		var curve = new EllipseCurve( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation );

		if ( this.curves.length > 0 ) {

			// if a previous curve is present, attempt to join
			var firstPoint = curve.getPoint( 0 );

			if ( ! firstPoint.equals( this.currentPoint ) ) {

				this.lineTo( firstPoint.x, firstPoint.y );

			}

		}

		this.curves.push( curve );

		var lastPoint = curve.getPoint( 1 );
		this.currentPoint.copy( lastPoint );

	},

	absarc: function ( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

		this.absellipse( aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise );

	},
	// To get accurate point with reference to
	// entire path distance at time t,
	// following has to be done:

	// 1. Length of each sub path have to be known
	// 2. Locate and identify type of curve
	// 3. Get t for the curve
	// 4. Return curve.getPointAt(t')

	getPoint: function ( t ) {

		var d = t * this.getLength();
		var curveLengths = this.getCurveLengths();
		var i = 0;

		// To think about boundaries points.

		while ( i < curveLengths.length ) {

			if ( curveLengths[ i ] >= d ) {

				var diff = curveLengths[ i ] - d;
				var curve = this.curves[ i ];

				var segmentLength = curve.getLength();
				var u = segmentLength === 0 ? 0 : 1 - diff / segmentLength;

				return curve.getPointAt( u );

			}

			i ++;

		}

		return null;

		// loop where sum != 0, sum > d , sum+1 <d

	},

	// We cannot use the default THREE.Curve getPoint() with getLength() because in
	// THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
	// getPoint() depends on getLength

	getLength: function () {

		var lens = this.getCurveLengths();
		return lens[ lens.length - 1 ];

	},

	// cacheLengths must be recalculated.
	updateArcLengths: function () {

		this.needsUpdate = true;
		this.cacheLengths = null;
		this.getCurveLengths();

	},

	// Compute lengths and cache them
	// We cannot overwrite getLengths() because UtoT mapping uses it.

	getCurveLengths: function () {

		// We use cache values if curves and cache array are same length

		if ( this.cacheLengths && this.cacheLengths.length === this.curves.length ) {

			return this.cacheLengths;

		}

		// Get length of sub-curve
		// Push sums into cached array

		var lengths = [], sums = 0;

		for ( var i = 0, l = this.curves.length; i < l; i ++ ) {

			sums += this.curves[ i ].getLength();
			lengths.push( sums );

		}

		this.cacheLengths = lengths;

		return lengths;

	},

	getSpacedPoints: function ( divisions ) {

		if ( divisions === undefined ) divisions = 40;

		var points = [];

		for ( var i = 0; i <= divisions; i ++ ) {

			points.push( this.getPoint( i / divisions ) );

		}

		if ( this.autoClose ) {

			points.push( points[ 0 ] );

		}

		return points;

	},

	getPoints: function ( divisions ) {

		divisions = divisions || 12;

		var points = [], last;

		for ( var i = 0, curves = this.curves; i < curves.length; i ++ ) {

			var curve = curves[ i ];
			var resolution = ( curve && curve.isEllipseCurve ) ? divisions * 2
				: ( curve && curve.isLineCurve ) ? 1
					: ( curve && curve.isSplineCurve ) ? divisions * curve.points.length
						: divisions;

			var pts = curve.getPoints( resolution );

			for ( var j = 0; j < pts.length; j ++ ) {

				var point = pts[ j ];

				if ( last && last.equals( point ) ) continue; // ensures no consecutive points are duplicates

				points.push( point );
				last = point;

			}

		}

		if ( this.autoClose && points.length > 1 && ! points[ points.length - 1 ].equals( points[ 0 ] ) ) {

			points.push( points[ 0 ] );

		}

		return points;

	}

} );


export { Path };
