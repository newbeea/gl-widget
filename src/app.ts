import { Renderer, Background } from './Renderer';

import { Clock } from './Clock';
import * as backgroundShader from '../examples/background'
import * as shapeShader from '../examples/shape'

import { Shape } from './extras/plugins/Shape';
import * as font from '../examples/font/averia.json';
import { Font } from './extras/plugins/Font'
import { Vector2 } from './math/Vector2';

import { ShapeUtils } from "./extras/plugins/Shape/ShapeUtils";

const renderer: Renderer = new Renderer({
    element: 'awesome-bg'
}, {});

let f = new Font(font)
let shapes = f.generateShapes('P', 0.5 , 8)

let shapePoints = shapes[0].extractPoints(12)
shapePoints.shape.pop()

var h,hl,ahole

var vertices = shapePoints.shape;
var holes = shapePoints.holes;

var reverse = ! ShapeUtils.isClockWise( vertices );

if ( reverse ) {

  vertices = vertices.reverse();

  // Maybe we should also check if holes are in the opposite direction, just to be safe ...

  for ( h = 0, hl = holes.length; h < hl; h ++ ) {

    ahole = holes[ h ];

    if ( ShapeUtils.isClockWise( ahole ) ) {

      holes[ h ] = ahole.reverse();

    }

  }

}

let index = ShapeUtils.triangulateShape(vertices, holes)
let position = []
vertices.forEach(element => {
  position.push(element.x, element.y)  
});
let hole = holes.flat()
hole.forEach(element => {
  position.push(element.x, element.y)  
});

let background: Background = new Background(backgroundShader.fluidShader);
let shape: Shape = new Shape(index, position, shapeShader.gradientShader)
renderer.render(background, shape);


// test custom uniforms by users
// let clock = new Clock()
// function animate() {
//   renderer.setUniform(background, 'time', clock.getElapsedTime())
//   requestAnimationFrame(animate)
// }
// animate()
// document.body.appendChild(renderer.canvas);
