import { Renderer, Background, Clock, CAMERA, Object3D } from './Renderer';
import { Vector3 } from './math/Vector3';
import backgroundShader from '../examples/background/index'
import shapeShader from '../examples/shape/index'

const renderer: Renderer = new Renderer({
  cameraMode: CAMERA.ORTHOGRAPHIC,
  element: 'awesome-bg'
}, {});

let scene: Object3D = new Object3D()
let uniforms = {
  time: {
    value: 0
  }
}
let background: Background = new Background({
  fragmentShader: backgroundShader.fluidShader, 
  uniforms: uniforms
});

import font from '../examples/font/averia.json';
import { FontElement, Alignment } from './extras/plugins/Font'
let element = new FontElement('ab', font, {
  size: 0.5,
  alignment: Alignment.CENTERMIDDLE
}, {
  fragmentShader: shapeShader.gradientShader,
  uniforms: uniforms
})
element.position.y = -1
// element.position = new Vector3(-2, 0, 0) // raise
// element.scale.x = 0.5

// element.rotateY(0.5)
// element.rotateX(0.5)
scene.add(element)

import { SvgElement } from './extras/plugins/Svg'
import parseXML from 'xml-parse-from-string'
import svgString from '../examples/svg/good.svg';
let doc = parseXML(svgString)
let svgNode = doc.querySelector('svg');
let svg = new SvgElement(svgNode, {
  size: 1,
  // isCCW: true                                                   
  // alignment: Alignment.CENTERMIDDLE
}, {
  fragmentShader: shapeShader.gradientShader,
  uniforms: uniforms
})
scene.add(svg)

// scene.position.x =-1



renderer.render(background, scene);


// test custom uniforms by users
let clock = new Clock()
function animate() {
  background.uniforms['time'].value = clock.getElapsedTime()
  svg.uniforms['time'].value = clock.getElapsedTime()
  requestAnimationFrame(animate)
}
animate()



// document.body.appendChild(renderer.canvas);
