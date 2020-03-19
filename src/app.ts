import { Renderer, Background, Clock, CAMERA, Object3D } from './Renderer';
import { Vector3 } from './math/Vector3';
import backgroundShader from '../examples/background/index'
import shapeShader from '../examples/shape/index'
import Texture from './Texture'

import AB from '.'
const renderer: Renderer = new Renderer({
  // cameraMode: CAMERA.ORTHOGRAPHIC,
  element: 'awesome-bg'
}, {});

let scene: Object3D = new Object3D()
let image = new Image()
image.src = require('../examples/image/combine.png').default
let images = []
let imagenames = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz']

for (let i = 0; i < 6; i++) {
  let image = new Image()
  image.src = require(`../examples/image/${imagenames[i]}.jpg`).default
  images.push(image)
}
// Background
let background: Background = new Background({
  fragmentShader: backgroundShader.curveShader,
  uniforms: {
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
  },
  side: AB.RenderSide.DOUBLE
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
import { Vector2 } from './math/Vector2';

let svg = new SvgElement({
  fragmentShader: backgroundShader.fluidShader,
  uniforms: {
    resolution: {
      value: new Vector2(800, 480)
    },
    time: {
      value: 0
    }
  },
  side: AB.RenderSide.DOUBLE
}, svgNode, {
  size: 1,
  // isCCW: true                                                   
  // alignment: Alignment.CENTERMIDDLE
})
scene.add(svg)
// svg.rotateY(1)
// scene.position.x =-1

// Shere
import { SphereElement } from './extras/plugins/Geometries'
import { BlinnPhongMaterial, PhongMaterial, CopyShader } from './extras/plugins/Materials';
let sphere = new SphereElement(new PhongMaterial, {
  radius: 0.4, 
})
scene.add(sphere)
sphere.position.y = 1



// Box
import { SkyBox } from './SkyBox'
import { PerspectiveCamera } from './cameras/PerspectiveCamera';
import { OrthographicCamera } from './cameras/OrthographicCamera';

let sky = new SkyBox({
  uniforms: {
    cube: {
      value: new Texture(images, 1, 1)
    }
  }
})
sky.scale.x = 10
sky.scale.y = 10
sky.scale.z = 10

// plane

import { PlaneGeometry } from './extras/plugins/Geometries/PlaneGeometry';
import { RenderableElement } from './RenderableElement';
import { RenderFlow } from './RenderFlow';
import { RenderPass } from './extras/plugins/Pass/RenderPass';
import { Shader } from './Shader';
import { ShaderPass } from './extras/plugins/Pass/ShaderPass';

let planeGeometry = new PlaneGeometry()
let copyShader = new CopyShader()
let plane = new RenderableElement(copyShader, planeGeometry)
plane.position.x = 1
copyShader.uniforms.tDiffuse.value = new Texture(image, 1, 1)
scene.add(plane)
// let frustumSize = 8
// let aspect = renderer.canvas.width / renderer.canvas.height
// let camera: any = new OrthographicCamera(
//   frustumSize * aspect / -2, 
//   frustumSize * aspect / 2, 
//   frustumSize / 2, 
//   frustumSize / -2, 
//   -1000, 
//   1000)

// camera = new PerspectiveCamera(50, renderer.canvas.width/renderer.canvas.height, 1, 1000) 
let camera = renderer.defaultCamera
renderer.render(sky, scene, camera);

// render flow
let renderFlow = new RenderFlow(renderer)
let renderPass = new RenderPass(sky, scene, camera)
let copyShader2 = new CopyShader()
let copyPass = new ShaderPass(copyShader2)
renderFlow.addPass(renderPass)
// renderFlow.addPass(copyPass)
// renderFlow.render()
// test custom uniforms by users
let clock = new Clock()
let phi = 0
let r = 4
function animate() {

  camera.position.x = r * Math.sin(phi)
  camera.position.z = r * Math.cos(phi)
  phi += 0.001
  camera.lookTarget()
  background.uniforms['time'].value = clock.getElapsedTime()
  svg.uniforms['time'].value = clock.getElapsedTime()
  // renderer.render(sky, scene, camera, true);
  // renderFlow.render()
  requestAnimationFrame(animate)
}
animate()



// document.body.appendChild(renderer.canvas);
