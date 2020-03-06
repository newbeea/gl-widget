import { Renderer, Background, Clock, CAMERA, Object3D } from './Renderer';
import { Vector3 } from './math/Vector3';
import backgroundShader from '../examples/background/index'
import shapeShader from '../examples/shape/index'
import Texture from './Texture'
const renderer: Renderer = new Renderer({
  // cameraMode: CAMERA.ORTHOGRAPHIC,
  element: 'awesome-bg'
}, {});

let scene: Object3D = new Object3D()
let image = new Image()
image.src = require('../examples/image/combine.png').default

// Background
let background: Background = new Background({
  fragmentShader: `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float time;
  uniform vec2 resolution;
  uniform sampler2D map;

  void main()
  {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  
    gl_FragColor = texture2D(map, uv);
  }
  `,
  uniforms: {
    map: {
      value: new Texture(image, 1, 1)
      
    },
    time: {
      value: 0
    }
  }
});

// Text
import fontJson from '../examples/font/averia.json';
import { FontElement, Alignment } from './extras/plugins/Font'
let text = new FontElement({
  fragmentShader: shapeShader.gradientShader,
  uniforms: {
    time: {
      value: 0
    }
  }
}, 'Phil', {
  font: fontJson,
  size: 0.5,
  alignment: Alignment.CENTERMIDDLE
}, )
text.position.y = -1
// element.position = new Vector3(-2, 0, 0) // raise
// element.scale.x = 0.5
// element.rotateY(0.5)
// element.rotateX(0.5)
scene.add(text)

// Svg
import { SvgElement } from './extras/plugins/Svg'
import parseXML from 'xml-parse-from-string'
import svgString from '../examples/svg/good.svg';
let doc = parseXML(svgString)
let svgNode = doc.querySelector('svg');


let svg = new SvgElement({
  fragmentShader: shapeShader.gradientShader,
  uniforms: {
    time: {
      value: 0
    }
  }
}, svgNode, {
  size: 1,
  // isCCW: true                                                   
  // alignment: Alignment.CENTERMIDDLE
})
scene.add(svg)
// scene.position.x =-1

// Shere
import { SphereElement } from './extras/plugins/Geometries'
import { BlinnPhongMaterial, PhongMaterial } from './extras/plugins/Materials';

let sphere = new SphereElement(new PhongMaterial, {
  radius: 0.4, 
})
scene.add(sphere)
sphere.position.y = 1
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
