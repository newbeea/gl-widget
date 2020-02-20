import { Path } from './Path';
import { EllipseCurve } from './EllipseCurve';


function Shape( points? ) {

	Path.call( this, points );

	this.type = 'Shape';

	this.holes = [];

}

Shape.prototype = Object.assign( Object.create( Path.prototype ), {

	constructor: Shape,

	getPointsHoles: function ( divisions ) {

		var holesPts = [];

		for ( var i = 0, l = this.holes.length; i < l; i ++ ) {

			holesPts[ i ] = this.holes[ i ].getPoints( divisions );

		}

		return holesPts;

	},

	// get points of shape and holes (keypoints based on segments parameter)

	extractPoints: function ( divisions ) {

		return {

			shape: this.getPoints( divisions ),
			holes: this.getPointsHoles( divisions )

		};

	},
	
	copy: function ( source ) {

		Path.prototype.copy.call( this, source );

		this.holes = [];

		for ( var i = 0, l = source.holes.length; i < l; i ++ ) {

			var hole = source.holes[ i ];

			this.holes.push( hole.clone() );

		}

		return this;

	},

	toJSON: function () {

		var data = Path.prototype.toJSON.call( this );

		data.uuid = this.uuid;
		data.holes = [];

		for ( var i = 0, l = this.holes.length; i < l; i ++ ) {

			var hole = this.holes[ i ];
			data.holes.push( hole.toJSON() );

		}

		return data;

	},

	fromJSON: function ( json ) {

		Path.prototype.fromJSON.call( this, json );

		this.uuid = json.uuid;
		this.holes = [];

		for ( var i = 0, l = json.holes.length; i < l; i ++ ) {

			var hole = json.holes[ i ];
			this.holes.push( new Path().fromJSON( hole ) );

		}

		return this;

	}

} );


export { Shape };
