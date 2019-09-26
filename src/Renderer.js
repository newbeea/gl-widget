"use strict";
var Renderer = (function () {
    function Renderer(options, attributes) {
        if (options === void 0) { options = {}; }
        if (attributes === void 0) { attributes = {}; }
        this.canvas = options.canvas
            || document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        var defaultAttributes = {
            alpha: false,
            depth: true,
            stencil: true,
            antialias: false,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false
        };
        attributes = Object.assign(defaultAttributes, attributes);
        this.context = options.context
            || this.canvas.getContext('webgl', attributes)
            || this.canvas.getContext('experimental-webgl', attributes);
    }
    Renderer.prototype.render = function () {
        console.log('rendering');
    };
    return Renderer;
}());
exports.Renderer = Renderer;
