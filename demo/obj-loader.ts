import { Renderer, RenderableElement, Object3D } from '../src/'
import OrbitControls  from '../src/extras/plugins/Controls/OrbitControls'
import BlinnPhongMaterial from '../src/extras/plugins/Materials/BlinnPhongMaterial'

import { Geometry } from '../src'
import xhr from 'xhr'
import parseOBJ from 'parse-wavefront-obj'
import { Float32Attribute } from '../src/Float32Attribute';
import { Uint32Attribute } from '../src/Uint32Attribute';

let scene: Object3D = new Object3D
xhr({
  method: 'GET',
  url: '/examples/obj/cube.obj'
}, function (err, res, body) {
  if (err) return
  if (!/^2/.test(res.statusCode + '')) {
      return
  }
  let obj = parseOBJ(body);
  let geometry = new Geometry() 
  let normal = []
  console.log(obj);
  let position = []
  let index = []
  for (let i = 0; i < obj.cells.length; i ++) {
    let positionIndies = obj.cells[i]
    let normalIndies = obj.faceNormals[i]
    for(let j = 0; j < 3; j ++) {
      for(let k = 0; k < 3; k ++) {
        position.push(obj.positions[positionIndies[j]][k])
        normal.push(obj.vertexNormals[normalIndies[j]][k])
      }
    }

    index.push(i * 3, i * 3 + 1, i * 3 + 2)

    
    // console.log(normalIndies)
    // normal = normal.concat(obj.vertexNormals[normalIndies[0]])
    // normal = normal.concat(obj.vertexNormals[normalIndies[1]])
    // normal = normal.concat(obj.vertexNormals[normalIndies[2]])
    // console.log(normal)
    // obj.vertexNormals[obj.faceNormals[face[0]][0]]
    // console.log(obj.faceNormals[face[0]])
    // console.log(obj.vertexNormals[obj.faceNormals[face[0]][0]])

    
    // face.forEach(pointIndex => {
    //   console.log(pointIndex)
    //   let normalIndex = obj.faceNormals[pointIndex]
    //   console.log(normalIndex)
    //   let normal = obj.vertexNormals[normalIndex]
    //   console.log(normal)
    // });
    // normal.push(
    //   obj.vertexNormals[obj.faceNormals[face[0]]],
    //   obj.vertexNormals[obj.faceNormals[face[1]]],
    //   obj.vertexNormals[obj.faceNormals[face[2]]]
    // )
  }
  // console.log(position)
  // console.log(index)
  // console.log(normal)
  geometry.addAttribute('position', new Float32Attribute(position, 3))
  geometry.addAttribute('index', new Uint32Attribute(index, 1))
  geometry.addAttribute('normal',  new Float32Attribute( normal, 3 ) );
  console.log(normal);

  let mesh = new RenderableElement(new BlinnPhongMaterial(), geometry)
  scene.add(mesh)
})

let renderer = new Renderer({
  element: 'awesome-bg'
})
let camera = renderer.defaultCamera
renderer.render(undefined, scene);
let controls = new OrbitControls(camera, renderer.canvas)
function animate() {
  controls.update()
  requestAnimationFrame(animate)
}
animate()

