import { Renderer, Background } from './Renderer';

import { Clock } from './Clock';
import * as backgroundShader from '../examples/background'
import * as shapeShader from '../examples/shape'

import * as font from '../examples/font/averia.json';
import { FontElement } from './extras/plugins/Font'

const renderer: Renderer = new Renderer({
    element: 'awesome-bg'
}, {});

let background: Background = new Background(backgroundShader.fluidShader);
let element = new FontElement('a', font, {
  size: 1
}, shapeShader.gradientShader)

renderer.render(background, element);


// test custom uniforms by users
// let clock = new Clock()
// function animate() {
//   renderer.setUniform(background, 'time', clock.getElapsedTime())
//   requestAnimationFrame(animate)
// }
// animate()
// document.body.appendChild(renderer.canvas);
