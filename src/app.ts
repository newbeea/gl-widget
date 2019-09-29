// import "@babel/polyfill";
// import './feature';

import { Renderer, Background } from './Renderer';
import { Clock } from './Clock';

const renderer: Renderer = new Renderer({}, {
  depth: false
})
let backgroundShader = `
  precision mediump float;
  uniform vec2 resolution;
  uniform float     time; 
  void main () {
  vec2 uv = gl_FragCoord.xy/resolution.xy;   
  vec3 col = 0.5 + 0.5*cos(time+uv.xyx+vec3(0,2,4));
  gl_FragColor = vec4(col,1.0);
  }
`
let fragmentShader = backgroundShader || 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}'
let background: Background = new Background(fragmentShader)

renderer.render(background)
let clock = new Clock()
function animate() {
  // var time = gl.getUniformLocation(program, 'time');
  // gl.uniform1f(time, clock.getElapsedTime())
  // renderer.setUniform(background, 'time', clock.getElapsedTime())
  requestAnimationFrame(animate)
}
animate()
document.body.appendChild(renderer.canvas)
