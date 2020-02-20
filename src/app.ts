import { Renderer, Background, Clock, CAMERA } from './Renderer';
import { Vector3 } from './math/Vector3';
// import { Clock } from './Clock';
import backgroundShader from '../examples/background'
import shapeShader from '../examples/shape'




const renderer: Renderer = new Renderer({
  cameraMode: CAMERA.ORTHOGRAPHIC,
  element: 'awesome-bg'
}, {});

let background: Background = new Background(backgroundShader.fluidShader);

import font from '../examples/font/averia.json';
import { FontElement, Alignment } from './extras/plugins/Font'
let element = new FontElement('ab', font, {
  size: 1,
  alignment: Alignment.CENTERMIDDLE
}, shapeShader.gradientShader)

import { SvgElement } from './extras/plugins/Svg'
import parseXML from 'xml-parse-from-string'
import svgString from '../examples/svg/heart.svg';
let doc = parseXML(svgString)
let svgNode = doc.querySelector('svg');
let svg = new SvgElement(svgNode, {
  size: 2,                                                                
  // alignment: Alignment.CENTERMIDDLE
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
