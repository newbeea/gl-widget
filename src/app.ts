import { Renderer, Background } from './Renderer';

import { Clock } from './Clock';
import * as backgroundShader from '../examples/background'
import * as shapeShader from '../examples/shape'

import { Shape } from './extras/plugins/Shape';
import * as font from '../examples/font/averia.json';
import { Font } from './extras/plugins/Font'
import { Vector2 } from './math/Vector2';
const renderer: Renderer = new Renderer({
    element: 'awesome-bg'
}, {});

let f = new Font(font)
let shapes = f.generateShapes('P', 1)
let s = shapes[0].extractPoints()
console.log(shapes[0].extractPoints())
let background: Background = new Background(backgroundShader.fluidShader);
let shape: Shape = new Shape({
    contour: s.shape}, shapeShader.gradientShader)
renderer.render(background, shape);


// test custom uniforms by users
// let clock = new Clock()
// function animate() {
//   renderer.setUniform(background, 'time', clock.getElapsedTime())
//   requestAnimationFrame(animate)
// }
// animate()
// document.body.appendChild(renderer.canvas);
