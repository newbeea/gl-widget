import { Renderer, Background, Clock, CAMERA } from './Renderer';
import { Vector3 } from './math/Vector3';
// import { Clock } from './Clock';
import * as backgroundShader from '../examples/background'
import * as shapeShader from '../examples/shape'

import * as font from '../examples/font/averia.json';
import { FontElement, Alignment } from './extras/plugins/Font'
import { SvgElement } from './extras/plugins/Svg'

const renderer: Renderer = new Renderer({
  cameraMode: CAMERA.ORTHOGRAPHIC,
  element: 'awesome-bg'
}, {});

let background: Background = new Background(backgroundShader.fluidShader);
let element = new FontElement('ab', font, {
  size: 1,
  alignment: Alignment.CENTERMIDDLE
}, shapeShader.gradientShader)

import parseXML from 'xml-parse-from-string'
let doc = parseXML(`
  <svg viewBox="0 0 100 100">
    <path fill="#000000" stroke-width="3" d="m23.5,43.45313c16,36 43,24 42,5c-1,-19 7,-40 -17,-26c-24,14 -41,-15 -25,21z" id="svg_1"/>
  <svg>
`)
let svgNode = doc.querySelector('svg');
let svg = new SvgElement(svgNode, {
  size: 1,
  alignment: Alignment.CENTERMIDDLE
}, shapeShader.gradientShader)
// element.position.x = -1
// element.position = new Vector3(-2, 0, 0)
// element.scale.x = 0.5

// element.rotateY(0.5)
// element.rotateX(0.5)

renderer.render(background, svg);


// test custom uniforms by users
// let clock = new Clock()
// function animate() {
//   renderer.setUniform(background, 'time', clock.getElapsedTime())
//   requestAnimationFrame(animate)
// }
// animate()
// document.body.appendChild(renderer.canvas);
