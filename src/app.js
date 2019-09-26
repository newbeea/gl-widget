"use strict";
// import "@babel/polyfill";
require('./feature');
var Renderer_1 = require('./Renderer');
var renderer = new Renderer_1.Renderer({}, {
    depth: false
});
renderer.render();
