// import "@babel/polyfill";
// import './feature';

import { Renderer } from './Renderer';
 
const renderer: Renderer = new Renderer({}, {
    depth: false
})
 renderer.render()
 document.body.appendChild(renderer.canvas)
