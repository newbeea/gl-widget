
import { Shapes } from '../Curve/Shapes';
import { ShapeGeometry, Alignment, Flip } from '../ShapeGeometry'
import { Vector2 } from '../../../math/Vector2';
import { Shape } from '../Curve/Shape';
const DEGS_TO_RADS = Math.PI / 180,
  UNIT_SIZE = 100;
const DIGIT_0 = 48,
  DIGIT_9 = 57,
  COMMA = 44,
  SPACE = 32,
  PERIOD = 46,
  MINUS = 45;
function traverseNodes(child, obj, attributes = {}) {
  for (let i in child.childNodes) {
    let c = child.childNodes[i];
    // console.log(c);
    if (c.tagName) {
      // console.log(c.getAttribute('display'));
      if (c.getAttribute('display') == 'none') continue;

      // console.log(c.tagName);
      let sw = parseFloat(c.getAttribute('stroke-width'))
      let node: any = {
      }
      Object.assign(node, attributes)
      
      let transform = c.getAttribute('transform')
      // console.log(transform);
      if (transform) {
        if (transform.indexOf('matrix') !== -1) {
          node.matrix = []
          let matrix = transform.match(/-?[0-9]+\.[0-9]+|-?[0-9]+/g)
          for (let i = 0; i < matrix.length; ++i) {
            node.matrix[i] = parseFloat(matrix[i])
          }
          // console.log(node.matrix)       

        }

      }
      switch (c.tagName) {
        case 'path':
          node.d = c.getAttribute('d');
          obj.paths.push(node);
          break;
        case 'polygon':
          node.points = c.getAttribute('points');
          obj.polygons.push(node);
          break;
        case 'polyline':
          node.points = c.getAttribute('points');
          obj.polylines.push(node);
          break;
        case 'circle':
          node.cx = c.getAttribute('cx');
          node.cy = c.getAttribute('cy');
          node.r = c.getAttribute('r');
          obj.circles.push(node);
          break;
        case 'rect':
          node.x = c.getAttribute('x');
          node.y = c.getAttribute('y');
          node.width = c.getAttribute('width');
          node.height = c.getAttribute('height');
          obj.rects.push(node);
          break;
        case 'ellipse':
          node.cx = c.getAttribute('cx');
          node.cy = c.getAttribute('cy');
          node.rx = c.getAttribute('rx');
          node.ry = c.getAttribute('ry');
          obj.ellipses.push(node);
          break;
        case 'line':
          node.x1 = c.getAttribute('x1');
          node.y1 = c.getAttribute('y1');
          node.x2 = c.getAttribute('x2');
          node.y2 = c.getAttribute('y2');
          obj.lines.push(node);
          break;
      }

      traverseNodes(c, obj, attributes);
    }
  }
}
function transformSVGPath(path, scale, isCCW) {
  var pathStr = path.d;
  var path = new Shapes();
  var idx = 1,
    len = pathStr.length,
    activeCmd,
    x = 0,
    y = 0,
    nx = 0,
    ny = 0,
    firstX = null,
    firstY = null,
    x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0,
    rx = 0,
    ry = 0,
    xar = 0,
    laf = 0,
    sf = 0,
    cx, cy;

  function eatNum() {
    var sidx, c, isFloat = false,
      s;
    // eat delims
    while (idx < len) {
      c = pathStr.charCodeAt(idx);
      if (c !== COMMA && c !== SPACE) break;
      idx++;
    }
    if (c === MINUS) sidx = idx++;
    else sidx = idx;
    // eat number
    while (idx < len) {
      c = pathStr.charCodeAt(idx);
      if (DIGIT_0 <= c && c <= DIGIT_9) {
        idx++;
        continue;
      } else if (c === PERIOD) {
        idx++;
        isFloat = true;
        continue;
      }
      s = pathStr.substring(sidx, idx);
      // console.log(parseFloat(s));
      let num = isFloat ? parseFloat(s) : parseInt(s);
      return num
    }
    s = pathStr.substring(sidx);
    // console.log(parseFloat(s));
    let num = isFloat ? parseFloat(s) : parseInt(s);
    return num
  }

  function nextIsNum() {
    var c;
    // do permanently eat any delims...
    while (idx < len) {
      c = pathStr.charCodeAt(idx);
      if (c !== COMMA && c !== SPACE) break;
      idx++;
    }
    c = pathStr.charCodeAt(idx);
    return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
  }
  var canRepeat;
  var relative;
  activeCmd = pathStr[0];
  while (idx <= len) {
    canRepeat = true;
    relative = false;
    switch (activeCmd) {
      // moveto commands, become lineto's if repeated
      case 'M':
        x = eatNum() * scale;
        y = eatNum() * scale;
        // if (viewBox && ((x < viewBox.x1 || x > viewBox.x2) || (y < viewBox.y1 || y > viewBox.y2))) return -1;
        path.moveTo(x, y);
        activeCmd = 'L';
        firstX = x;
        firstY = y;
        break;
      case 'm':
        x += eatNum() * scale;
        y += eatNum() * scale;
        path.moveTo(x, y);
        activeCmd = 'l';
        firstX = x;
        firstY = y;
        break;
      case 'Z':
      case 'z':
        canRepeat = false;
        if (x !== firstX || y !== firstY) path.lineTo(firstX, firstY);
        break;
      // - lines!
      case 'L':
      case 'H':
      case 'V':
        nx = (activeCmd === 'V') ? x : eatNum() * scale;
        ny = (activeCmd === 'H') ? y : eatNum() * scale;
        path.lineTo(nx, ny);
        x = nx;
        y = ny;
        break;
      case 'l':
      case 'h':
      case 'v':
        nx = (activeCmd === 'v') ? x : (x + eatNum() * scale);
        ny = (activeCmd === 'h') ? y : (y + eatNum() * scale);
        path.lineTo(nx, ny);
        x = nx;
        y = ny;
        break;
      // - cubic bezier
      case 'C':
        x1 = eatNum() * scale;
        y1 = eatNum() * scale;
      case 'S':
        if (activeCmd === 'S') {
          x1 = 2 * x - x2;
          y1 = 2 * y - y2;
        }
        x2 = eatNum() * scale;
        y2 = eatNum() * scale;
        nx = eatNum() * scale;
        ny = eatNum() * scale;
        path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
        x = nx;
        y = ny;
        break;
      case 'c':
        x1 = x + eatNum() * scale;
        y1 = y + eatNum() * scale;
      case 's':
        if (activeCmd === 's') {
          x1 = 2 * x - x2;
          y1 = 2 * y - y2;
        }
        x2 = x + eatNum() * scale;
        y2 = y + eatNum() * scale;
        nx = x + eatNum() * scale;
        ny = y + eatNum() * scale;
        path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
        x = nx;
        y = ny;
        break;
      // - quadratic bezier
      case 'Q':
        x1 = eatNum() * scale;
        y1 = eatNum() * scale;
      case 'T':
        if (activeCmd === 'T') {
          x1 = 2 * x - x1;
          y1 = 2 * y - y1;
        }
        nx = eatNum() * scale;
        ny = eatNum() * scale;
        path.quadraticCurveTo(x1, y1, nx, ny);
        x = nx;
        y = ny;
        break;
      case 'q':
        x1 = x + eatNum() * scale;
        y1 = y + eatNum() * scale;
      case 't':
        if (activeCmd === 't') {
          x1 = 2 * x - x1;
          y1 = 2 * y - y1;
        }
        nx = x + eatNum() * scale;
        ny = y + eatNum() * scale;
        path.quadraticCurveTo(x1, y1, nx, ny);
        x = nx;
        y = ny;
        break;
      // - elliptical arc
      case 'a':
        rx = eatNum() * scale;
        ry = eatNum() * scale;
        xar = eatNum() * DEGS_TO_RADS;
        laf = eatNum();
        sf = eatNum();
        nx = x + eatNum() * scale;
        ny = y + eatNum() * scale;
        // console.log(nx, ny);
        relative = true;
      case 'A':
        if (!relative) {
          rx = eatNum() * scale;
          ry = eatNum() * scale;
          xar = eatNum() * DEGS_TO_RADS;
          laf = eatNum();
          sf = eatNum();
          nx = eatNum() * scale;
          ny = eatNum() * scale;
          // console.log(nx, ny);
        }
        if (rx !== ry) {
          console.warn("Forcing elliptical arc to be a circular one :(", rx, ry);
        }
        // SVG implementation notes does all the math for us! woo!
        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        // step1, using x1 as x1'
        x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
        y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
        // step 2, using x2 as cx'
        var norm = Math.sqrt(
          (rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1) / (rx * rx * y1 * y1 + ry * ry * x1 * x1));
        if (laf === sf) norm = -norm;
        x2 = norm * rx * y1 / ry;
        y2 = norm * -ry * x1 / rx;
        // step 3
        cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
        cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;
        var u = new Vector2(1, 0),
          v = new Vector2((x1 - x2) / rx, (y1 - y2) / ry);
        var startAng = Math.acos(u.dot(v) / u.length() / v.length());
        if (u.x * v.y - u.y * v.x < 0) startAng = -startAng;
        // we can reuse 'v' from start angle as our 'u' for delta angle
        u.x = (-x1 - x2) / rx;
        u.y = (-y1 - y2) / ry;
        var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
        let cw = sf == 1 ? true: false
        // This normalization ends up making our curves fail to triangulate...
        if (v.x * u.y - v.y * u.x < 0) deltaAng = -deltaAng;

        if (!cw && deltaAng > 0) deltaAng -= Math.PI * 2;
        if (cw && deltaAng < 0) deltaAng += Math.PI * 2;
 
        path.absarc(cx, cy, rx, startAng, startAng + deltaAng, cw);
        x = nx;
        y = ny;
        break;
      case ' ':
        break;
      default:
        console.log("weird path command: " + activeCmd);
        return false;
    }
    // just reissue the command
    if (canRepeat && nextIsNum()) continue;
    activeCmd = pathStr[idx++];
  }

  return path.toShapes(isCCW);
}
function addPaths(paths: Array<any>, transform: Function, scale, isCCW?: Boolean): Array<any> {
  var len = paths.length;
  let shapes = []
  for (var i = 0; i < len; ++i) {
    // console.log(paths[i]);
    var path = transform(paths[i], scale, isCCW);
    // if (path == false) {
    //   // console.log('none path', path);
    //   return shapes;
    // }
    // if (path == -1) continue;
    // var simpleShapes = path.toShapes(true);
    if (path instanceof(Array)) {
      shapes.push(...path)
    } else {
      shapes.push(path)
    }
    

  }
  return shapes;
}

function transformSVGCircle(circle, scale) {
  var path = new Shape();
  var x = parseFloat(circle.cx) * scale;
  var y = parseFloat(circle.cy) * scale;
  var r = parseFloat(circle.r) * scale;
  path.moveTo(x + r, y);
  path.absarc(x, y, r, 0, Math.PI * 2, false);
  return path;
}
function transformSVGEllipse(ellipse, scale) {
  var path = new Shape();
  var x = parseFloat(ellipse.cx) * scale;
  var y = parseFloat(ellipse.cy) * scale;
  var rx = parseFloat(ellipse.rx) * scale;
  var ry = parseFloat(ellipse.ry) * scale;
  path.moveTo(x + rx, y);
  path.absellipse(x, y, rx, ry, 0, Math.PI * 2, false);
  return path;
}
function applyMatrix(x, y, m ) {
  var v = {
    x: 0,
    y: 0
  }
  if (m) {
      v.x = m[0]*x + m[2]*y + m[4]
      v.y = m[1]*x + m[3]*y + m[5]
  } else {
      v.x = x
      v.y = y
  }
  return v;
}
function transformSVGRect(rect, scale) {
  var path = new Shape();
  var x = parseFloat(rect.x) * scale;
  var y = parseFloat(rect.y) * scale;
  var width = parseFloat(rect.width) * scale;
  var height = parseFloat(rect.height) * scale;

  var v;
  // var m = [0.9214, 0.3885, -0.3885, 0.9214, 39.3114, -44.4205]
  // m = [1, 0, 0, 1, 30, 30]
  v = applyMatrix(x, y, rect.matrix)
  path.moveTo(v.x, v.y);
  v = applyMatrix(x + width, y, rect.matrix)
  path.lineTo(v.x, v.y);
  v = applyMatrix(x + width, y + height, rect.matrix)
  path.lineTo(v.x, v.y);
  v = applyMatrix(x, y + height, rect.matrix)
  path.lineTo(v.x, v.y);
  return path;
}
function transformSVGPolygon(polygon, scale) {
  var polygonStr = polygon.points;
  String.prototype.trim = function() {　　
      return this.replace(/(^\s*)|(\s*$)/g, "");　　
  }
  var path = new Shapes();
  var points = polygonStr.split(' ');

  var index = 0;
  for (var i in points) {
      var p = points[i].trim();
      if (!p) continue;
      var point = p.split(',');
      var x = parseFloat(point[0]) * scale;
      var y = parseFloat(point[1]) * scale;
      if (index == 0) {
          path.moveTo(x, y);
      } else {
          path.lineTo(x, y);
      }
      index++;
  };
  return path.toShapes();
}
function generateShapes(node, size, isCCW) {
  let obj: any = {};
  obj.paths = [];
  obj.polygons = [];
  obj.polylines = [];
  obj.circles = [];
  obj.ellipses = [];
  obj.rects = [];
  obj.lines = [];
  let viewBox: string = node.getAttribute('viewBox')
  let height = parseInt(viewBox.split(' ')[3])
  let scale = size / height
  
  traverseNodes(node, obj)
  // console.log(obj)
  let shapes: Array<any> = addPaths(obj.paths, transformSVGPath, scale, isCCW) 
  shapes.push(...addPaths(obj.ellipses, transformSVGEllipse, scale) )
  shapes.push(...addPaths(obj.circles, transformSVGCircle, scale) )
  shapes.push(...addPaths(obj.rects, transformSVGRect, scale) )
  shapes.push(...addPaths(obj.polygons, transformSVGPolygon, scale) )
  return shapes
}

interface SvgOptions {
  size?: number
  alignment?: Alignment
  flip?: Flip
  isCCW?: Boolean
}

class SvgGeometry extends ShapeGeometry {
  constructor(node, options: SvgOptions = {}) {
    options = Object.assign({
      size: 1,
      isCCW: false,
      alignment: Alignment.CENTERMIDDLE,
      flip: Flip.TOPBOTTOM // svg to webgl: y' = -y
    }, options)
    super()
    let shapes = generateShapes(node, options.size, options.isCCW)
    this.generateGeometry(shapes, options.alignment, options.flip)
  }

}


export { SvgGeometry };
