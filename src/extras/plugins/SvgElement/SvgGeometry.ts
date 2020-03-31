// import { parse } from 'extract-svg-path'
import svgMesh3d from 'svg-mesh-3d'
import { Geometry } from '@gl-widget/gl-widget'

import parseXML from 'xml-parse-from-string'
function traverseNodes(child, paths, attributes = {}) {
  for (let i in child.childNodes) {
    let c = child.childNodes[i];

    if (c.tagName) {

      if (c.getAttribute('display') == 'none') continue;

      // let node: any = {
      // }
      // Object.assign(node, attributes)

      // let transform = c.getAttribute('transform')
      // // console.log(transform);
      // if (transform) {
      //   if (transform.indexOf('matrix') !== -1) {
      //     node.matrix = []
      //     let matrix = transform.match(/-?[0-9]+\.[0-9]+|-?[0-9]+/g)
      //     for (let i = 0; i < matrix.length; ++i) {
      //       node.matrix[i] = parseFloat(matrix[i])
      //     }
      //     // console.log(node.matrix)       

      //   }

      // }
      switch (c.tagName) {
        case 'path':
          paths.push(c.getAttribute('d'))
          break;
        // case 'polygon':
        //   node.points = c.getAttribute('points');
        //   obj.polygons.push(node);
        //   break;
        // case 'polyline':
        //   node.points = c.getAttribute('points');
        //   obj.polylines.push(node);
        //   break;
        // case 'circle':
        //   node.cx = c.getAttribute('cx');
        //   node.cy = c.getAttribute('cy');
        //   node.r = c.getAttribute('r');
        //   obj.circles.push(node);
        //   break;
        // case 'rect':
        //   node.x = c.getAttribute('x');
        //   node.y = c.getAttribute('y');
        //   node.width = c.getAttribute('width');
        //   node.height = c.getAttribute('height');
        //   obj.rects.push(node);
        //   break;
        // case 'ellipse':
        //   node.cx = c.getAttribute('cx');
        //   node.cy = c.getAttribute('cy');
        //   node.rx = c.getAttribute('rx');
        //   node.ry = c.getAttribute('ry');
        //   obj.ellipses.push(node);
        //   break;
        // case 'line':
        //   node.x1 = c.getAttribute('x1');
        //   node.y1 = c.getAttribute('y1');
        //   node.x2 = c.getAttribute('x2');
        //   node.y2 = c.getAttribute('y2');
        //   obj.lines.push(node);
        //   break;
      }

      traverseNodes(c, paths, attributes);
    }
  }
}

class SvgGeometry extends Geometry {
  constructor(svg, options) {
    // var svgPath = parse(svg)
    // var d = 'M1024 358.156C1024 195.698 892.3 64 729.844 64 643.482 64 565.814 101.218 512 160.49 458.186 101.218 380.518 64 294.156 64 131.698 64 0 195.698 0 358.156 0 444.518 37.218 522.186 96.49 576L96 576l320 320c32 32 64 64 96 64s64-32 96-64l320-320-0.49 0C986.782 522.186 1024 444.518 1024 358.156zM841.468 481.232 517.49 805.49c-1.678 1.678-3.532 3.532-5.49 5.48-1.96-1.95-3.814-3.802-5.49-5.48L182.532 481.234C147.366 449.306 128 405.596 128 358.156 128 266.538 202.538 192 294.156 192c47.44 0 91.15 19.366 123.076 54.532L512 350.912l94.768-104.378C638.696 211.366 682.404 192 729.844 192 821.462 192 896 266.538 896 358.156 896 405.596 876.632 449.306 841.468 481.232z';

    // let doc = parseXML(svg)
   
    // console.log(svg, svgNode)
    let paths = []
    traverseNodes(svg, paths)
    var mesh = svgMesh3d(paths.join(), {
      delaunay: false,
      scale: 4
    })

    console.log(mesh)
    super(mesh)
    
  }
}
  
export { SvgGeometry };
  