import { Renderer, Background } from './Renderer';

import { Clock } from './Clock';
import * as exampleShader from '../examples'
import { Shape } from './extras/plugins/Shape';

const renderer: Renderer = new Renderer({
    element: 'awesome-bg'
}, {});


let background: Background = new Background(exampleShader.fluidShader);
let shape: Shape = new Shape(exampleShader.gradientShader)
renderer.render(background, shape);


// test custom uniforms by users
// let clock = new Clock()
// function animate() {
//   renderer.setUniform(background, 'time', clock.getElapsedTime())
//   requestAnimationFrame(animate)
// }
// animate()
// document.body.appendChild(renderer.canvas);
