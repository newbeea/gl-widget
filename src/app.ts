// import "@babel/polyfill";
// import './feature';

import { Renderer, Background } from './Renderer';
import { Clock } from './Clock';
import * as exampleShader from '../examples'

const renderer: Renderer = new Renderer({}, {
  depth: false
});
let backgroundShader = exampleShader.fireShader

let background: Background = new Background(backgroundShader);

renderer.render(background);


// test custom uniforms by users
// let clock = new Clock()
// function animate() {
//   renderer.setUniform(background, 'time', clock.getElapsedTime())
//   requestAnimationFrame(animate)
// }
// animate()
document.body.appendChild(renderer.canvas);
